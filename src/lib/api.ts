import type { Results, VotePayload } from "./types";

export interface VoteResponse extends Results {
  ok: boolean;
  alreadyVoted: boolean;
  message?: string;
  error?: string;
}

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { ok?: boolean; error?: string };
  if (!res.ok && data?.error) throw new ApiError(data.error, res.status);
  return data;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}

export async function fetchResults(pollSlug = "global"): Promise<Results> {
  const res = await fetch(`/api/results?poll=${encodeURIComponent(pollSlug)}`, {
    credentials: "same-origin",
  });
  return parse<Results>(res);
}

export async function submitVote(payload: VotePayload): Promise<VoteResponse> {
  const res = await fetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });
  return parse<VoteResponse>(res);
}
