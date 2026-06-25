import { schedules } from "@trigger.dev/sdk/v3";
import Anthropic from "@anthropic-ai/sdk";
import { webSearch } from "../lib/agents/search";
import {
  SOCIAL_LISTENING_SYSTEM_PROMPT,
  buildSocialListeningMessage,
} from "../lib/agents/prompts/social-listening";
import { resend } from "../lib/resend";
import { prisma } from "../lib/prisma";
import { createElement } from "react";
import { MorningBrief } from "../emails/MorningBrief";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function sendFallbackEmail(date: string) {
  const recipients = (process.env.MARKETING_TEAM_EMAILS ?? "").split(",").filter(Boolean);
  if (!recipients.length) return;

  await resend.emails.send({
    from: "briefings@afrova.io",
    to: recipients,
    subject: `Afrova Morning Brief — ${date}`,
    html: `<p><strong>[AGENT: SOCIAL BRIEF]</strong></p><p>No significant Nigerian real estate news found today (${date}). The agent will try again tomorrow.</p>`,
    headers: {
      "X-Email-Type": "agent-social-brief",
      "X-Agent-Id": "social-listening",
    },
  });
}

export const socialListeningTask = schedules.task({
  id: "social-listening",
  cron: "0 6 * * *", // 06:00 UTC = 07:00 WAT daily
  maxDuration: 120,

  run: async () => {
    const date = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // 1. Run 4 searches in parallel
    const [re, fx, mkt, dia] = await Promise.all([
      webSearch("Nigerian real estate news today"),
      webSearch("NGN USD exchange rate today"),
      webSearch(`Lagos property market ${currentMonth}`),
      webSearch("diaspora Nigeria investment news"),
    ]);

    const combined = [re, fx, mkt, dia].filter(Boolean).join("\n\n---\n\n");

    // 2. Fallback if no results
    if (!combined.trim()) {
      await sendFallbackEmail(date);
      await prisma.agentActionLog.create({
        data: { agentId: "social-listening", action: "fallback", status: "fallback" },
      });
      return { status: "fallback" };
    }

    // 3. Call Claude Haiku 4.5
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      system: SOCIAL_LISTENING_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildSocialListeningMessage(combined) }],
    });

    const rawText = (msg.content[0] as { type: string; text: string }).text
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
    const rawBriefing = JSON.parse(rawText) as {
      stories: { title: string; why: string }[];
      contentAngles: (string | { angle: string })[];
      dataPoint: string;
      emailTemplates: { name: string; subject: string; body: string }[];
    };

    // Normalize contentAngles — Claude occasionally returns objects instead of plain strings
    const briefing = {
      ...rawBriefing,
      contentAngles: rawBriefing.contentAngles.map((a) =>
        typeof a === "string" ? a : a.angle
      ) as [string, string],
    };

    // 4. Save email templates generated from content angles
    if (briefing.emailTemplates?.length) {
      for (const t of briefing.emailTemplates) {
        await prisma.emailTemplate.create({
          data: {
            name: t.name,
            subject: t.subject,
            body: t.body,
            isAgentGenerated: true,
          },
        });
      }
    }

    // 5. Save to agent log
    await prisma.agentActionLog.create({
      data: {
        agentId: "social-listening",
        action: "morning-brief-sent",
        payload: briefing,
        status: "completed",
      },
    });

    // 5. Send email via Resend with custom headers
    const recipients = (process.env.MARKETING_TEAM_EMAILS ?? "").split(",").filter(Boolean);
    if (recipients.length) {
      await resend.emails.send({
        from: "briefings@afrova.io",
        to: recipients,
        subject: `Afrova Morning Brief — ${date}`,
        react: createElement(MorningBrief, { date, ...briefing }),
        headers: {
          "X-Email-Type": "agent-social-brief",
          "X-Agent-Id": "social-listening",
        },
      });
    }

    return { status: "completed", date };
  },
});
