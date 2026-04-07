import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { MainLayout } from "@/components/layout";
import {
  isInsightsUnlocked,
  markInsightsUnlocked,
  verifyInsightsPassword,
} from "@/lib/insights-gate";

/**
 * Client-side password gate. See src/lib/insights-gate.ts for the
 * important caveat: this is soft-auth, not real security.
 */
export function InsightsGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUnlocked(isInsightsUnlocked());
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const ok = await verifyInsightsPassword(password);
      if (ok) {
        markInsightsUnlocked();
        setUnlocked(true);
        setPassword("");
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Could not verify password in this browser.");
    } finally {
      setBusy(false);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <MainLayout>
      <div className="max-w-sm mx-auto mt-16">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-lg font-heading font-semibold">Insights is private</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Enter the password to continue. This panel is for the site owner.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="Password"
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy || !password}
              className="w-full px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {busy ? "Checking..." : "Unlock"}
            </button>
          </form>
          <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
            Note: this is a soft client-side gate, not real authentication. The bundled
            JavaScript is public, so do not rely on it to protect secrets.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
