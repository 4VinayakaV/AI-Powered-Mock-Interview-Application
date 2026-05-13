import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { desc, eq } from "drizzle-orm";

import { chatSession, model } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

export const runtime = "nodejs";

function extractJson(text) {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleanedText.indexOf("[");
  const end = cleanedText.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return a JSON array.");
  }

  const jsonText = cleanedText.slice(start, end + 1);
  JSON.parse(jsonText);
  return jsonText;
}

async function getResumePart(file) {
  if (!file || file.size === 0) {
    return null;
  }

  if (file.type !== "application/pdf") {
    throw new Error("Resume must be uploaded as a PDF file.");
  }

  const arrayBuffer = await file.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString("base64"),
      mimeType: "application/pdf",
    },
  };
}

export async function GET() {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const interviews = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Failed to load interviews:", error);
    return NextResponse.json({ error: "Could not load interviews." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const formData = await request.formData();
    const jobPosition = formData.get("jobPosition")?.toString().trim();
    const jobDesc = formData.get("jobDesc")?.toString().trim();
    const jobExperience = formData.get("jobExperience")?.toString().trim();
    const resumeFile = formData.get("resume");

    if (!jobPosition || !jobDesc || !jobExperience) {
      return NextResponse.json({ error: "All interview fields are required." }, { status: 400 });
    }

    let resumePart = null;
    try {
      resumePart = await getResumePart(resumeFile);
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    let jsonMockResp;
    try {
      const prompt = `
You are an expert technical interviewer.

Create exactly 5 mock interview questions for this candidate. The questions must be customized to the target role, job description, years of experience, and resume content when a resume PDF is attached.

Target role:
${jobPosition}

Years of experience:
${jobExperience}

Job description:
${jobDesc}

Candidate resume:
${resumePart ? "A resume PDF is attached. Read it and use the candidate's projects, skills, experience, and education to customize the interview." : "No resume was uploaded. Base the interview on the job description and experience only."}

Requirements:
- Ask practical, role-specific questions that combine the job description with the candidate's resume experience.
- If a resume is attached, include at least 2 questions that reference skills, projects, tools, or responsibilities from the resume.
- Keep questions realistic for a mock interview.
- Return only a valid JSON array.
- Each array item must have exactly these keys: question, answer.
- The answer should be a strong sample answer in 3 to 6 sentences.
`;
      const result = resumePart
        ? await model.generateContent([{ text: prompt }, resumePart])
        : await chatSession.sendMessage(prompt);
      const rawResponse = await result.response.text();
      jsonMockResp = extractJson(rawResponse);
    } catch (error) {
      console.error("Gemini interview generation failed:", error);
      return NextResponse.json(
        { error: `Gemini failed to generate questions: ${error.message}` },
        { status: 502 },
      );
    }

    const mockId = uuidv4();

    let createdInterview;
    try {
      [createdInterview] = await db.insert(MockInterview).values({
        mockId,
        jsonMockResp,
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format("MM-DD-yyyy"),
      }).returning({ mockId: MockInterview.mockId });
    } catch (error) {
      console.error("Database interview save failed:", error);
      return NextResponse.json(
        { error: `Database failed to save interview: ${error.message}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ mockId: createdInterview?.mockId || mockId });
  } catch (error) {
    console.error("Failed to create interview:", error);
    return NextResponse.json(
      { error: "Could not create the interview. Check your Gemini and database configuration." },
      { status: 500 },
    );
  }
}
