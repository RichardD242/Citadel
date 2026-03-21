import { getSupabaseClient, getWaitlistTableName } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const rawEmail = typeof req.body?.email === "string" ? req.body.email : "";
  const email = rawEmail.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase is not configured." });
  }

  const table = getWaitlistTableName();
  const { error } = await supabase.from(table).insert({ email });

  if (error) {
    return res.status(500).json({ error: "Failed to save email." });
  }

  return res.status(201).json({ ok: true });
}