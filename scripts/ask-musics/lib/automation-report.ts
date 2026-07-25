import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { ProcessResult } from "./process-result";
import { AskMusicRequest } from "../types";

export type AutomationReportStatus =
  | "empty"
  | "success"
  | "partial"
  | "failed"
  | "error";

export type AutomationReport = {
  ran_at: string;
  is_dry_run: boolean;
  status: AutomationReportStatus;
  requests: AskMusicRequest[];
  results: ProcessResult[];
  error?: string;
};

export const AUTOMATION_REPORT_PATH = join(
  process.cwd(),
  "scripts/ask-musics/last-run-report.json"
);

export function summarizeResults(results: ProcessResult[]) {
  return {
    added: results.filter((result) => result.status === "added").length,
    skipped: results.filter((result) => result.status === "skipped").length,
    failed: results.filter((result) => result.status === "failed").length,
  };
}

export function resolveAutomationStatus(
  results: ProcessResult[]
): Exclude<AutomationReportStatus, "empty" | "error"> {
  const { added, skipped, failed } = summarizeResults(results);

  if (failed === 0) {
    return "success";
  }

  if (added + skipped === 0) {
    return "failed";
  }

  return "partial";
}

export async function writeAutomationReport(
  report: AutomationReport
): Promise<string> {
  await writeFile(
    AUTOMATION_REPORT_PATH,
    JSON.stringify(report, null, 2),
    "utf8"
  );

  return AUTOMATION_REPORT_PATH;
}

export async function readAutomationReport(
  filePath = AUTOMATION_REPORT_PATH
): Promise<AutomationReport> {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as AutomationReport;
}
