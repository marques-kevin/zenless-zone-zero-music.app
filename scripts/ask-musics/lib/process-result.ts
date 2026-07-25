export type ProcessResult = {
  url: string;
  status: "added" | "skipped" | "failed";
  message: string;
  title_id?: string;
};
