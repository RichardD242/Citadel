import { getBearerToken, verifyAdminToken } from "../_lib/admin-auth.js";
import { getSupabaseClient, getWaitlistTableName } from "../_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const token = getBearerToken(req);
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({ error: "Supabase is not configured." });
  }

  const table = getWaitlistTableName();
  const { data, error } = await supabase
    .from(table)
    .select("email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Failed to load signups." });
  }

  const signups = (data || []).map((row) => ({
    email: row.email,
    timestamp: row.created_at,
  }));

  return res.status(200).json({ signups });
}