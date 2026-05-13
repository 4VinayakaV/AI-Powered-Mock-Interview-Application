import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import moment from "moment";

import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

function extractFeedbackJson(text) {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleanedText.indexOf("{");
  const end = cleanedText.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return a JSON object.");
  }

  return JSON.parse(cleanedText.slice(start, end + 1));
}

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const { mockId, question, correctAns, userAns } = await request.json();

    if (!mockId || !question || !userAns) {
      return NextResponse.json({ error: "Question and answer are required." }, { status: 400 });
    }

    const prompt = `Question: ${question}. User Answer: ${userAns}. Compare the user's answer with the expected answer: ${correctAns || "Not provided"}. Return only a valid JSON object with these keys: rating, feedback. Rating should be a short score such as "7/10". Feedback should be 3 to 5 concise lines.`;
    const result = await chatSession.sendMessage(prompt);
    const rawResponse = await result.response.text();
    const feedbackResponse = extractFeedbackJson(rawResponse);

    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      question,
      correctAns,
      userAns,
      feedback: feedbackResponse.feedback,
      rating: feedbackResponse.rating,
      userEmail: user.primaryEmailAddress.emailAddress,
      createdAt: moment().format("MM-DD-yyyy"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save user answer:", error);
    return NextResponse.json({ error: `Could not save answer feedback: ${error.message}` }, { status: 500 });
  }
}
