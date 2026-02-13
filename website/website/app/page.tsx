"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints ?? 0) > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

export default function Page() {
  const [accepted, setAccepted] = useState(false);
  const [touch, setTouch] = useState(false);
  const [noMsg, setNoMsg] = useState<string | null>(null);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  // position of NO button in pixels relative to arena
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTouch(isTouchDevice());
  }, []);

  // Set initial NO position after layout
  useEffect(() => {
    const arena = arenaRef.current;
    const noBtn = noBtnRef.current;
    if (!arena || !noBtn) return;

    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    // initial: slightly right of center
    const x = a.width * 0.62 - b.width / 2;
    const y = a.height * 0.58 - b.height / 2;
    setNoPos({
      x: clamp(x, 12, a.width - b.width - 12),
      y: clamp(y, 12, a.height - b.height - 12),
    });
  }, []);

  const zeldaLines = useMemo(
    () => [
      "The hero of my heart has arrived.",
      "A legend begins with a single 'Yes'.",
      "Will you join my party for this quest?",
      "The Triforce of Romance awaits…",
    ],
    []
  );

  const [subtitle] = useState(() => zeldaLines[Math.floor(Math.random() * zeldaLines.length)]);

  function repositionNoAwayFromPointer(px: number, py: number) {
    const arena = arenaRef.current;
    const noBtn = noBtnRef.current;
    if (!arena || !noBtn) return;

    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    // Current center of NO button
    const cx = noPos.x + b.width / 2;
    const cy = noPos.y + b.height / 2;

    // Vector away from pointer
    let dx = cx - px;
    let dy = cy - py;

    // If pointer is exactly on center, randomize direction
    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
      dx = Math.random() - 0.5;
      dy = Math.random() - 0.5;
    }

    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    dx /= len;
    dy /= len;

    // Move distance scales a bit with arena size
    const step = clamp(a.width * 0.18, 110, 190);

    // Add a small random jitter so it feels playful
    const jitter = 18;
    const nx =
      noPos.x + dx * step + (Math.random() * jitter - jitter / 2);
    const ny =
      noPos.y + dy * step + (Math.random() * jitter - jitter / 2);

    setNoPos({
      x: clamp(nx, 12, a.width - b.width - 12),
      y: clamp(ny, 12, a.height - b.height - 12),
    });
  }

  function onNoHover(e: React.MouseEvent) {
    if (touch || accepted) return; // hover-runaway only for desktop
    const arena = arenaRef.current;
    if (!arena) return;
    const a = arena.getBoundingClientRect();
    // pointer position relative to arena
    const px = e.clientX - a.left;
    const py = e.clientY - a.top;
    repositionNoAwayFromPointer(px, py);
  }

  function onNoClick() {
    if (accepted) return;
    if (touch) {
      // Mobile: NO doesn't work
      setNoMsg("⚔️ Your tap was deflected by the Master Shield.");
      window.setTimeout(() => setNoMsg(null), 1600);
      return;
    }
    // Desktop: if they somehow click it, still deny and move
    setNoMsg("✨ The 'No' option has fled into the Lost Woods.");
    window.setTimeout(() => setNoMsg(null), 1600);

    // Move it to a random safe spot
    const arena = arenaRef.current;
    const noBtn = noBtnRef.current;
    if (!arena || !noBtn) return;
    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();
    setNoPos({
      x: clamp(Math.random() * (a.width - b.width - 24) + 12, 12, a.width - b.width - 12),
      y: clamp(Math.random() * (a.height - b.height - 24) + 12, 12, a.height - b.height - 12),
    });
  }

  return (
    <div className="min-h-[100svh] w-full overflow-hidden bg-[#06140f] text-white">
      {/* background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(34,197,94,0.25),rgba(0,0,0,0.9))]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,215,128,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,215,128,0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
        {/* triforce-ish glow triangles */}
        <div className="absolute left-1/2 top-[10%] h-[260px] w-[260px] -translate-x-1/2 opacity-60 blur-[0.5px]">
          <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-l-[65px] border-r-[65px] border-b-[110px] border-l-transparent border-r-transparent border-b-[rgba(250,204,21,0.34)]" />
          <div className="absolute left-[48px] top-[98px] h-0 w-0 border-l-[65px] border-r-[65px] border-b-[110px] border-l-transparent border-r-transparent border-b-[rgba(250,204,21,0.28)]" />
          <div className="absolute right-[48px] top-[98px] h-0 w-0 border-l-[65px] border-r-[65px] border-b-[110px] border-l-transparent border-r-transparent border-b-[rgba(250,204,21,0.28)]" />
        </div>
      </div>

      <main className="relative mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(34,197,94,0.12)] backdrop-blur-xl md:p-10">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-xs tracking-wider text-yellow-100">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
              HYRULE ROMANCE QUEST
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
              Will you be my Valentine?
            </h1>
            <p className="mt-3 text-balance text-sm text-white/75 md:text-base">
              {subtitle}
            </p>
          </div>

          {accepted ? (
            <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-400/10 p-6 text-center">
              <div className="text-2xl md:text-3xl">🏹 Quest Accepted!</div>
              <p className="mt-2 text-white/80">
                The legend grows… I’ll see you in Hyrule (or, y’know, on a date).
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  +100 Heart Containers
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  +1 Legendary Memory
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Master Sword: Equipped
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto mt-6 text-center text-xs text-white/60">
                {touch ? "Mobile mode: the 'No' button is… magically sealed." : "Desktop mode: try catching 'No' 👀"}
              </div>

              <div
                ref={arenaRef}
                className="relative mt-6 h-[320px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 md:h-[360px]"
              >
                {/* YES button centered-ish */}
                <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setAccepted(true)}
                    className="group relative rounded-2xl border border-yellow-300/30 bg-yellow-300/15 px-8 py-4 text-lg font-semibold shadow-[0_0_30px_rgba(250,204,21,0.18)] transition-transform active:scale-[0.98] md:hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.35),transparent_60%)]" />
                    YES 💛
                    <span className="ml-2 text-xs font-normal text-white/70">(Take the Oath)</span>
                  </button>
                </div>

                {/* NO button that runs away (desktop) / ignores taps (mobile) */}
                <button
                  ref={noBtnRef}
                  onMouseEnter={onNoHover}
                  onMouseMove={onNoHover}
                  onClick={onNoClick}
                  style={{
                    transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                  }}
                  className={[
                    "absolute left-0 top-0 select-none rounded-2xl border px-7 py-3 text-base font-semibold transition-transform",
                    "border-white/15 bg-white/6 text-white/80",
                    "shadow-[0_0_24px_rgba(0,0,0,0.25)]",
                    touch ? "active:scale-100" : "md:hover:scale-[1.01]",
                  ].join(" ")}
                >
                  NO 💀
                </button>

                {/* floating message */}
                <div className="pointer-events-none absolute bottom-4 left-1/2 w-[92%] -translate-x-1/2 text-center">
                  {noMsg ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-white/80 backdrop-blur">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                      {noMsg}
                    </div>
                  ) : (
                    <div className="text-xs text-white/45">
                      Tip: This page looks best with dramatic Zelda music.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/55">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  🟢 Kokiri Forest vibes
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  🟡 Triforce glow
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  ⚔️ No = impossible
                </span>
              </div>
            </>
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-white/40">
          Not affiliated with Nintendo. Just a legendary Valentine side-quest.
        </footer>
      </main>
    </div>
  );
}