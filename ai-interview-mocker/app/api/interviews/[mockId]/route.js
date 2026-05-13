import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";

export async function GET(_request, { params }) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const { mockId } = await params;
    const [interview] = await db.select().from(MockInterview)
      .where(and(
        eq(MockInterview.mockId, mockId),
        eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress),
      ));

    if (!interview) {
      return NextResponse.json({ error: "Interview not found." }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("Failed to load interview:", error);
    return NextResponse.json({ error: "Could not load interview." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const { mockId } = await params;
    const [interview] = await db.select({ mockId: MockInterview.mockId }).from(MockInterview)
      .where(and(
        eq(MockInterview.mockId, mockId),
        eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress),
      ));

    if (!interview) {
      return NextResponse.json({ error: "Interview not found." }, { status: 404 });
    }

    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));
    await db.delete(MockInterview).where(and(
      eq(MockInterview.mockId, mockId),
      eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress),
    ));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete interview:", error);
    return NextResponse.json({ error: "Could not delete interview." }, { status: 500 });
  }
}
