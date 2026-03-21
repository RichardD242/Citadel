import express from "express";
import crypto from "node:crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(express.json());

const adminPassword = process.env.ADMIN_PASSWORD || "citadel-admin";
const adminSessions = new Map();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseTable = process.env.SUPABASE_WAITLIST_TABLE || "waitlist_signups";

const supabase =
  supabaseUrl && supabaseSecretKey
    ? createClient(supabaseUrl, supabaseSecretKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

function getBearerToken(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return "";
  }
  return auth.slice(7).trim();
}

function isSessionValid(token) {
  const expiresAt = adminSessions.get(token);
  if (!expiresAt) {
    return false;
  }
  if (Date.now() > expiresAt) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

app.post("/api/waitlist", async (req, res) => {
  const rawEmail = typeof req.body?.email === "string" ? req.body.email : "";
  const email = rawEmail.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  if (!supabase) {
    return res.status(500).json({ error: "Supabase is not configured." });
  }

  try {
    const { error } = await supabase
      .from(supabaseTable)
      .insert({ email });

    if (error) {
      return res.status(500).json({ error: "Failed to save email.", details: error.message });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Failed during waitlist signup processing", error);
    return res.status(500).json({ error: "Failed to save email." });
  }
});

app.post("/api/admin/login", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password." });
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  adminSessions.set(token, expiresAt);

  return res.json({ token, expiresAt });
});

app.get("/api/admin/signups", (req, res) => {
  const token = getBearerToken(req);
  if (!isSessionValid(token)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (!supabase) {
    return res.status(500).json({ error: "Supabase is not configured." });
  }

  supabase
    .from(supabaseTable)
    .select("email, created_at")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        return res.status(500).json({ error: "Failed to load signups." });
      }

      const signups = (data || []).map((row) => ({
        email: row.email,
        timestamp: row.created_at,
      }));

      return res.json({ signups });
    })
    .catch(() => res.status(500).json({ error: "Failed to load signups." }));
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`Waitlist API running on http://localhost:${port}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("Admin password is using default value. Set ADMIN_PASSWORD in .env for security.");
  }
  if (!supabase) {
    console.log("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.");
  }
});
