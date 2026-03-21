import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseSecretKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getWaitlistTableName() {
  return process.env.SUPABASE_WAITLIST_TABLE || "waitlist_signups";
}