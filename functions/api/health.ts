import type { Env } from "../../shared/types";
import { json } from "../../shared/util";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    await env.DB.prepare("SELECT 1").first();
    return json({ ok: true, db: "up" });
  } catch {
    return json({ ok: false, db: "down" }, { status: 503 });
  }
};
