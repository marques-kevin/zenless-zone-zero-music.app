export type AskMusicStatus = "pending" | "added" | "cancelled";

export type AskMusic = {
  url: string;
  users: string[];
  status: AskMusicStatus;
  cancel_reason?: string;
  created_at: Date;
  updated_at: Date;
};
