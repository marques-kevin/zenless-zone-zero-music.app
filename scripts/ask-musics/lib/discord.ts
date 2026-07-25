import { AutomationReport, summarizeResults } from "./automation-report";

const DISCORD_WEBHOOK_URL = process.env.ASK_MUSIC_DISCORD_WEBHOOK_URL?.trim();
const DISCORD_MESSAGE_LIMIT = 2000;

type DiscordEmbed = {
  title: string;
  description: string;
  color: number;
};

const STATUS_COLORS: Record<AutomationReport["status"], number> = {
  empty: 0x5865f2,
  success: 0x57f287,
  partial: 0xfaa61a,
  failed: 0xed4245,
  error: 0xed4245,
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

function formatReportDescription(report: AutomationReport): string {
  const mode = report.is_dry_run ? " (dry-run)" : "";
  const lines: string[] = [];

  if (report.status === "empty") {
    lines.push("No pending music requests to process.");
    return lines.join("\n");
  }

  if (report.status === "error") {
    lines.push(`**Fatal error:** ${report.error || "Unknown error"}`);
    return lines.join("\n");
  }

  const summary = summarizeResults(report.results);
  lines.push(
    `**Summary${mode}:** ${summary.added} added, ${summary.skipped} skipped, ${summary.failed} failed`
  );

  if (report.requests.length > 0) {
    lines.push("", "**Requests:**");
    for (const [index, request] of report.requests.entries()) {
      lines.push(`${index + 1}. ${request.url}`);
    }
  }

  if (report.results.length > 0) {
    lines.push("", "**Results:**");
    for (const result of report.results) {
      const icon =
        result.status === "added"
          ? "✅"
          : result.status === "skipped"
            ? "⏭️"
            : "❌";

      lines.push(`${icon} ${result.url}`, `   ${result.message}`);
    }
  }

  return lines.join("\n");
}

export async function sendAutomationReport(
  report: AutomationReport
): Promise<void> {
  const mode = report.is_dry_run ? " (dry-run)" : "";

  await sendDiscordPayload({
    embeds: [
      {
        title: `Ask Music automation report${mode}`,
        description: truncateMessage(formatReportDescription(report)),
        color: STATUS_COLORS[report.status],
      },
    ],
  });
}
