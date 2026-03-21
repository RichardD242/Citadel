import crypto from "node:crypto";

const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60 * 12;

function base64urlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64urlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLength);
  return Buffer.from(padded, "base64").toString("utf8");
}

function signValue(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminToken() {
  const secret = process.env.ADMIN_TOKEN_SECRET || "";
  if (!secret) {
    throw new Error("ADMIN_TOKEN_SECRET is not configured.");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const exp = nowSeconds + DEFAULT_EXPIRES_IN_SECONDS;
  const payload = JSON.stringify({ exp });
  const encoded = base64urlEncode(payload);
  const signature = signValue(encoded, secret);
  return `${encoded}.${signature}`;
}

export function verifyAdminToken(token) {
  const secret = process.env.ADMIN_TOKEN_SECRET || "";
  if (!secret || !token || !token.includes(".")) {
    return false;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return false;
  }

  const expectedSignature = signValue(encoded, secret);
  if (expectedSignature !== signature) {
    return false;
  }

  try {
    const payloadRaw = base64urlDecode(encoded);
    const payload = JSON.parse(payloadRaw);
    if (!payload.exp || typeof payload.exp !== "number") {
      return false;
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    return nowSeconds < payload.exp;
  } catch {
    return false;
  }
}

export function getBearerToken(request) {
  const authorization = request.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    return "";
  }
  return authorization.slice(7).trim();
}