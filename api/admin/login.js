import { createAdminToken } from "../_lib/admin-auth.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!adminPassword || !password || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password." });
  }

  try {
    const token = createAdminToken();
    return res.status(200).json({ token });
  } catch {
    return res.status(500).json({ error: "Admin token setup missing." });
  }
}