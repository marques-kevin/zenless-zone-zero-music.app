import {
  AUTOMATION_REPORT_PATH,
  AutomationReport,
  readAutomationReport,
} from "./lib/automation-report";
import { sendAutomationReport } from "./lib/discord";

type ParsedArgs = {
  file?: string;
  error?: string;
};

const args = new Set(process.argv.slice(2));

function printUsage() {
  console.log(
    [
      "Send a single Ask Music automation report to Discord",
      "",
      "Usage:",
      "  yarn ask-musics:send-report",
      "  yarn ask-musics:send-report --file <report.json>",
      "  yarn ask-musics:send-report --error <message>",
      "",
      "Defaults to scripts/ask-musics/last-run-report.json written by process-pending.",
      "Requires ASK_MUSIC_DISCORD_WEBHOOK_URL.",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--file") {
      parsed.file = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--error") {
      parsed.error = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function buildErrorReport(message: string): AutomationReport {
  return {
    ran_at: new Date().toISOString(),
    is_dry_run: false,
    status: "error",
    requests: [],
    results: [],
    error: message,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const parsed = parseArgs(argv);

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    const report: AutomationReport = parsed.error
      ? buildErrorReport(parsed.error)
      : await readAutomationReport(parsed.file ?? AUTOMATION_REPORT_PATH);

    await sendAutomationReport(report);
    console.log("Discord report sent.");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error sending report";

    console.error("Error sending automation report:", error);
    await sendAutomationReport(buildErrorReport(message));
    process.exit(1);
  }
}

main();
