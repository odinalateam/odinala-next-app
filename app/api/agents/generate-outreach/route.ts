import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  OUTREACH_SYSTEM_PROMPT,
  buildOutreachMessage,
  type ProspectInput,
  type OutreachResult,
} from "@/lib/agents/prompts/outreach-generator";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, location, profession, milestone, nigeriaConnection } = body as ProspectInput;

  if (!name || !location || !profession) {
    return NextResponse.json(
      { error: "name, location, and profession are required" },
      { status: 400 }
    );
  }

  const prospect: ProspectInput = { name, location, profession, milestone: milestone ?? "", nigeriaConnection: nigeriaConnection ?? "" };

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1500,
    system: OUTREACH_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildOutreachMessage(prospect) }],
  });

  const rawText = (msg.content[0] as { type: string; text: string }).text;
  const result: OutreachResult = JSON.parse(rawText);

  await prisma.agentActionLog.create({
    data: {
      agentId: "outreach-generator",
      action: "emails-generated",
      payload: { prospect, result } as unknown as Prisma.InputJsonValue,
      status: "completed",
    },
  });

  return NextResponse.json(result);
}
