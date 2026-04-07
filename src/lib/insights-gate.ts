/**
 * Soft password gate for the /insights page.
 *
 * ⚠️  This is NOT real security. The bundled JavaScript is public and
 *     a motivated visitor can bypass any client-side check. The goal
 *     here is just to keep casual visitors and search engines out of
 *     a private control panel on a static site that has no backend.
 *
 * How it works:
 *   - We store only a SHA-256 hash of the password below.
 *   - On submit the entered password is hashed in the browser via
 *     SubtleCrypto and compared.
 *   - On success a short token is written to sessionStorage so the
 *     gate does not re-prompt during the same tab session.
 *
 * How to change the password:
 *   1. Pick a new password.
 *   2. Run in a terminal (node):
 *        node -e "const c=require('crypto');console.log(c.createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
 *      or in a browser devtools console:
 *        crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_PASSWORD'))
 *          .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
 *   3. Paste the resulting hex string into INSIGHTS_PASSWORD_SHA256 below and commit.
 *
 * Default password is "changeme" — please replace it before relying on this gate.
 */

export const INSIGHTS_PASSWORD_SHA256 =
  "057ba03d6c44104863dc7361fe4578965d1887360f90a0895882e58a6248fc86"; // sha256("changeme")

const STORAGE_KEY = "__kk_insights_ok_v1";
// Any stable marker; value doesn't matter because this is soft auth.
const STORAGE_TOKEN = "ok";

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isInsightsUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === STORAGE_TOKEN;
  } catch {
    return false;
  }
}

export function markInsightsUnlocked() {
  try {
    sessionStorage.setItem(STORAGE_KEY, STORAGE_TOKEN);
  } catch {
    /* ignore */
  }
}

export function clearInsightsUnlocked() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export async function verifyInsightsPassword(candidate: string): Promise<boolean> {
  const hex = await sha256Hex(candidate);
  // Constant-time-ish compare (length always equal since both hex sha256).
  if (hex.length !== INSIGHTS_PASSWORD_SHA256.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) {
    diff |= hex.charCodeAt(i) ^ INSIGHTS_PASSWORD_SHA256.charCodeAt(i);
  }
  return diff === 0;
}
