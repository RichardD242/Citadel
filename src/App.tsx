import { FormEvent, useEffect, useMemo, useState } from "react";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

type SignupRow = {
  timestamp: string;
  email: string;
};

function LandingPage() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [noteClass, setNoteClass] = useState("text-white/80");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setNote("Enter a valid email address.");
      setNoteClass("text-rose-300");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalized }),
      });

      if (!response.ok) {
        throw new Error("Could not save your signup.");
      }

      setNote("You are on the Citadel waitlist.");
      setNoteClass("text-emerald-300");
      setEmail("");
    } catch {
      setNote("Could not save your signup right now. Please try again.");
      setNoteClass("text-rose-300");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="ethereal-bg pointer-events-none absolute inset-0 opacity-95">
        <EtheralShadow
          color="rgba(138, 156, 193, 0.96)"
          animation={{ scale: 100, speed: 98 }}
          noise={{ opacity: 0.7, scale: 1.2 }}
          sizing="fill"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      <div className="relative z-10 grid min-h-screen grid-rows-[auto_1fr_auto] px-4 pb-5 pt-6 sm:px-7 sm:py-7">
        <header className="flex justify-center">
          <img
            className="h-auto w-[220px] max-w-[72vw] sm:max-w-[35vw]"
            src="/logos/citadel-white-hzlgo-removebg-preview.png"
            alt="Citadel"
          />
        </header>

        <main className="mx-auto flex w-full max-w-[760px] flex-col justify-center pt-8 sm:-translate-y-[2vh] sm:pt-0">
          <h1 className="text-center text-[clamp(1.85rem,9.5vw,3.65rem)] font-extrabold leading-[1.04] tracking-[-0.02em]">
            Join the Waitlist!
          </h1>
          <p className="mt-3 text-center text-[clamp(0.9rem,1.25vw,1.08rem)] font-medium text-white/90">
            Be the first to know when we launch and step in early.
          </p>

          <form
            className="mx-auto mt-7 grid w-full max-w-[560px] grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto] sm:gap-2"
            onSubmit={onSubmit}
          >
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-[56px] w-full rounded-full border border-white/35 bg-[rgba(49,49,53,0.82)] px-6 text-base text-white outline-none transition focus:border-white/85 focus:bg-[rgba(60,60,65,0.9)] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.55)] sm:h-[58px]"
              required
            />
            <button
              type="submit"
              aria-label="Join waitlist"
              disabled={isSubmitting}
              className="inline-flex h-[56px] w-full items-center justify-center rounded-full border border-white/35 bg-[rgba(49,49,53,0.82)] p-0 text-white shadow-[0_10px_18px_rgba(0,0,0,0.30)] transition hover:-translate-y-px hover:bg-[rgba(61,61,67,0.92)] hover:shadow-[0_12px_22px_rgba(0,0,0,0.36)] sm:h-[58px] sm:w-[58px]"
            >
              <svg
                className="h-[21px] w-[21px]"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h12"
                  stroke="#f7f8fb"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m13 8 4 4-4 4"
                  stroke="#f7f8fb"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <p className={`mt-3 min-h-5 text-center text-[0.96rem] font-medium ${noteClass}`}>
            {note}
          </p>
        </main>

        <footer className="flex items-end justify-center gap-3 pb-1 pt-6">
          <a
            className="inline-flex h-[22px] w-[22px] items-center justify-center text-white/90 transition hover:-translate-y-px hover:text-white"
            href="https://www.instagram.com/realcitadel.store/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke="currentColor" strokeWidth="1.9" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
              <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => sessionStorage.getItem("citadel_admin_token") || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signups, setSignups] = useState<SignupRow[]>([]);

  const isLoggedIn = !!token;

  const fetchSignups = async (activeToken: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/signups", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = (await response.json()) as { signups: SignupRow[] };
      setSignups(data.signups || []);
    } catch {
      setError("Could not load signups. Check your password and try again.");
      setToken("");
      sessionStorage.removeItem("citadel_admin_token");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSignups(token);
    }
  }, [token]);

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Enter admin password.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      const data = (await response.json()) as { token: string };
      sessionStorage.setItem("citadel_admin_token", data.token);
      setToken(data.token);
      setPassword("");
    } catch {
      setError("Invalid password.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("citadel_admin_token");
    setToken("");
    setSignups([]);
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Citadel Admin</h1>
          <a className="text-sm text-white/70 underline hover:text-white" href="/">
            Back to site
          </a>
        </div>

        {!isLoggedIn ? (
          <form className="space-y-4" onSubmit={onLogin}>
            <label className="block text-sm text-white/80" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/30 bg-white/10 px-4 text-white outline-none focus:border-white/70"
              placeholder="Enter admin password"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 rounded-xl border border-white/30 bg-white/10 px-5 font-semibold transition hover:bg-white/20 disabled:opacity-60"
            >
              {isLoading ? "Checking..." : "Login"}
            </button>
            {error ? <p className="text-rose-300">{error}</p> : null}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/80">Total signups: {signups.length}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fetchSignups(token)}
                  className="h-10 rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-medium transition hover:bg-white/20"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="h-10 rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-medium transition hover:bg-white/20"
                >
                  Logout
                </button>
              </div>
            </div>

            {error ? <p className="text-rose-300">{error}</p> : null}

            <div className="overflow-hidden rounded-xl border border-white/20">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((row, index) => (
                    <tr key={`${row.email}-${row.timestamp}-${index}`} className="border-t border-white/10">
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3 text-white/75">{row.timestamp}</td>
                    </tr>
                  ))}
                  {signups.length === 0 && !isLoading ? (
                    <tr>
                      <td className="px-4 py-4 text-white/70" colSpan={2}>
                        No signups yet.
                      </td>
                    </tr>
                  ) : null}
                  {isLoading ? (
                    <tr>
                      <td className="px-4 py-4 text-white/70" colSpan={2}>
                        Loading...
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const isAdmin = useMemo(() => path.startsWith("/admin"), [path]);
  return isAdmin ? <AdminPage /> : <LandingPage />;
}

export default App;