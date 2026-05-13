import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

export async function GET(_request, { params }) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }

    const { mockId } = await params;
    const feedback = await db.select()
      .from(UserAnswer)
      .where(and(
        eq(UserAnswer.mockIdRef, mockId),
        eq(UserAnswer.userEmail, user.primaryEmailAddress.emailAddress),
      ))
      .orderBy(UserAnswer.id);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Failed to load feedback:", error);
    return NextResponse.json({ error: "Could not load feedback." }, { status: 500 });
  }
}
