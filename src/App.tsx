import { FormEvent, useState } from "react";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";

function App() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [noteClass, setNoteClass] = useState("text-white/80");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setNote("Enter a valid email address.");
      setNoteClass("text-rose-300");
      return;
    }

    setNote("You are on the Citadel waitlist.");
    setNoteClass("text-emerald-300");
    setEmail("");
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

      <div className="relative z-10 grid min-h-screen grid-rows-[auto_1fr_auto] px-4 py-7 sm:px-7">
        <header className="flex justify-center">
          <img
            className="h-auto w-[214px] max-w-[64vw] sm:max-w-[35vw]"
            src="/logos/citadel-white-hzlgo-removebg-preview.png"
            alt="Citadel"
          />
        </header>

        <main className="mx-auto flex w-full max-w-[760px] -translate-y-[2vh] flex-col justify-center">
          <h1 className="text-center text-[clamp(2.1rem,5.1vw,3.65rem)] font-extrabold leading-[1.03] tracking-[-0.02em]">
            Join the Waitlist!
          </h1>
          <p className="mt-3 text-center text-[clamp(0.9rem,1.25vw,1.08rem)] font-medium text-white/90">
            Be the first to know when we launch and step in early.
          </p>

          <form
            className="mx-auto mt-7 grid w-full max-w-[560px] grid-cols-[1fr_auto] items-center gap-2 max-[460px]:grid-cols-1"
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
              className="h-[58px] w-full rounded-full border border-white/35 bg-[rgba(49,49,53,0.82)] px-6 text-base text-white outline-none transition focus:border-white/85 focus:bg-[rgba(60,60,65,0.9)] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.55)]"
              required
            />
            <button
              type="submit"
              aria-label="Join waitlist"
              className="inline-flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white/35 bg-[rgba(49,49,53,0.82)] p-0 text-white shadow-[0_10px_18px_rgba(0,0,0,0.30)] transition hover:-translate-y-px hover:bg-[rgba(61,61,67,0.92)] hover:shadow-[0_12px_22px_rgba(0,0,0,0.36)] max-[460px]:w-full"
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

        <footer className="flex items-end justify-center gap-3 pb-1">
          <a
            className="inline-flex h-[22px] w-[22px] items-center justify-center text-white/90 transition hover:-translate-y-px hover:text-white"
            href="#"
            aria-label="Instagram"
          >
            <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" stroke="currentColor" strokeWidth="1.9" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
              <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
            </svg>
          </a>
          <a
            className="inline-flex h-[22px] w-[22px] items-center justify-center text-white/90 transition hover:-translate-y-px hover:text-white"
            href="#"
            aria-label="X"
          >
            <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 4h4.2l4.2 5.7L17.1 4H20l-6.2 7.3L20.5 20h-4.2l-4.8-6.4L6.5 20H3.6l6.4-7.5L4 4z"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;