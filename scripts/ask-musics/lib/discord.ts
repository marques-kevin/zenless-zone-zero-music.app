import { AskMusicRequest } from "../types";
import { ProcessResult } from "./process-result";

const DISCORD_WEBHOOK_URL = process.env.ASK_MUSIC_DISCORD_WEBHOOK_URL?.trim();
const DISCORD_MESSAGE_LIMIT = 2000;

type DiscordEmbed = {
  title: string;
  description: string;
  color: number;
};

function truncateMessage(content: string): string {
  if (content.length <= DISCORD_MESSAGE_LIMIT) {
    return content;
  }

  return `${content.slice(0, DISCORD_MESSAGE_LIMIT - 3)}...`;
}

async function sendDiscordPayload(payload: {
  content?: string;
  embeds?: DiscordEmbed[];
}): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    return;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn(
        `Discord webhook failed (${response.status}): ${body || response.statusText}`
      );
    }
  } catch (error) {
    console.warn("Failed to send Discord notification:", error);
  }
}

function formatRequestList(requests: AskMusicRequest[]): string {
  return requests
    .map((request, index) => {
      const users =
        request.users.length > 0
          ? ` (${request.users.length} user${request.users.length > 1 ? "s" : ""})`
          : "";

      return `${index + 1}. ${request.url}${users}`;
    })
    .join("\n");
}

export async function notifyAskMusicStarted({
  requests,
  is_dry_run,
}: {
  requests: AskMusicRequest[];
  is_dry_run: boolean;
}): Promise<void> {
  const mode = is_dry_run ? " (dry-run)" : "";
  const list = formatRequestList(requests);

  await sendDiscordPayload({
    embeds: [
      {
        title: `Ask Music automation started${mode}`,
        description: truncateMessage(
          `Processing **${requests.length}** request(s):\n\n${list}`
        ),
        color: 0x5865f2,
      },
    ],
  });
}

export async function notifyAskMusicRequestFailed({
  url,
  message,
}: {
  url: string;
  message: string;
}): Promise<void> {
  await sendDiscordPayload({
    embeds: [
      {
        title: "Ask Music request failed",
        description: truncateMessage(`**URL:** ${url}\n**Error:** ${message}`),
        color: 0xed4245,
      },
    ],
  });
}

export async function notifyAskMusicFinished({
  results,
  is_dry_run,
}: {
  results: ProcessResult[];
  is_dry_run: boolean;
}): Promise<void> {
  const added = results.filter((result) => result.status === "added").length;
  const skipped = results.filter((result) => result.status === "skipped").length;
  const failed = results.filter((result) => result.status === "failed").length;
  const mode = is_dry_run ? " (dry-run)" : "";
  const has_failures = failed > 0;

  const lines = results.map((result) => {
    const icon =
      result.status === "added"
        ? "✅"
        : result.status === "skipped"
          ? "⏭️"
          : "❌";

    return `${icon} ${result.url}\n   ${result.message}`;
  });

  await sendDiscordPayload({
    embeds: [
      {
        title: `Ask Music automation finished${mode}`,
        description: truncateMessage(
          [
            `**Summary:** ${added} added, ${skipped} skipped, ${failed} failed`,
            "",
            ...lines,
          ].join("\n")
        ),
        color: has_failures ? 0xfaa61a : 0x57f287,
      },
    ],
  });
}

export async function notifyAskMusicError(message: string): Promise<void> {
  await sendDiscordPayload({
    embeds: [
      {
        title: "Ask Music automation error",
        description: truncateMessage(message),
        color: 0xed4245,
      },
    ],
  });
}
