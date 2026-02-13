"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function detectTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints ?? 0) > 0 ||
    // @ts-ignore
    (navigator.msMaxTouchPoints ?? 0) > 0
  );
}

/** -------- Pixel Icons (simple retro SVGs) -------- */
function PixelHeart({
  size = 44,
  className = "",
  color = "rgb(0,255,120)",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 14"
      width={size}
      height={(size * 14) / 16}
      className={className}
      aria-hidden="true"
    >
      {[
        [1, 0],[2, 0],[4, 0],[5, 0],[10, 0],[11, 0],[13, 0],[14, 0],
        [0, 1],[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[9, 1],[10, 1],[11, 1],[12, 1],[13, 1],[14, 1],[15, 1],
        [0, 2],[1, 2],[2, 2],[3, 2],[4, 2],[5, 2],[6, 2],[7, 2],[8, 2],[9, 2],[10, 2],[11, 2],[12, 2],[13, 2],[14, 2],[15, 2],
        [1, 3],[2, 3],[3, 3],[4, 3],[5, 3],[6, 3],[7, 3],[8, 3],[9, 3],[10, 3],[11, 3],[12, 3],[13, 3],[14, 3],
        [2, 4],[3, 4],[4, 4],[5, 4],[6, 4],[7, 4],[8, 4],[9, 4],[10, 4],[11, 4],[12, 4],[13, 4],
        [3, 5],[4, 5],[5, 5],[6, 5],[7, 5],[8, 5],[9, 5],[10, 5],[11, 5],[12, 5],
        [4, 6],[5, 6],[6, 6],[7, 6],[8, 6],[9, 6],[10, 6],[11, 6],
        [5, 7],[6, 7],[7, 7],[8, 7],[9, 7],[10, 7],
        [6, 8],[7, 8],[8, 8],[9, 8],
        [7, 9],[8, 9],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
}

function PixelRupee({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} aria-hidden="true">
      <rect x="7" y="1" width="2" height="2" fill="rgb(0,255,120)" />
      <rect x="6" y="3" width="4" height="2" fill="rgb(0,255,120)" />
      <rect x="5" y="5" width="6" height="2" fill="rgb(0,255,120)" />
      <rect x="4" y="7" width="8" height="2" fill="rgb(0,255,120)" />
      <rect x="5" y="9" width="6" height="2" fill="rgb(0,255,120)" />
      <rect x="6" y="11" width="4" height="2" fill="rgb(0,255,120)" />
      <rect x="7" y="13" width="2" height="2" fill="rgb(0,255,120)" />
    </svg>
  );
}

function PixelTriforce({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 22" width={size} height={(size * 22) / 24} className={className} aria-hidden="true">
      <polygon points="12,2 18,12 6,12" fill="rgba(250,204,21,0.9)" />
      <polygon points="6,12 12,22 0,22" fill="rgba(250,204,21,0.8)" />
      <polygon points="18,12 24,22 12,22" fill="rgba(250,204,21,0.8)" />
    </svg>
  );
}

function PixelBomb({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} aria-hidden="true">
      <rect x="11" y="1" width="2" height="2" fill="rgba(250,204,21,0.9)" />
      <rect x="10" y="3" width="2" height="2" fill="rgba(250,204,21,0.8)" />
      <rect x="4" y="5" width="8" height="8" fill="rgba(255,255,255,0.12)" />
      <rect x="5" y="6" width="6" height="6" fill="rgba(0,0,0,0.55)" />
      <rect x="6" y="7" width="2" height="2" fill="rgba(255,255,255,0.16)" />
    </svg>
  );
}

function FairySpark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M10 1 L12 8 L19 10 L12 12 L10 19 L8 12 L1 10 L8 8 Z"
        fill="rgba(0,255,120,0.7)"
      />
      <circle cx="14.5" cy="5.2" r="1.2" fill="rgba(250,204,21,0.8)" />
    </svg>
  );
}

/** -------- Tiny client-only 8-bit chime (WebAudio) -------- */
function play8bitChime() {
  if (typeof window === "undefined") return;
  const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.value = 0.08; // keep it subtle
  master.connect(ctx.destination);

  // Simple “item get” style arpeggio
  const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6-ish
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square"; // 8-bit vibe
    osc.frequency.setValueAtTime(freq, now + i * 0.07);

    gain.gain.setValueAtTime(0.0001, now + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(1.0, now + i * 0.07 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.13);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.16);
  });

  // Close context shortly after to avoid lingering resources
  window.setTimeout(() => ctx.close().catch(() => {}), 600);
}

export default function Page() {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  // Hydration-safe: deterministic first render
  const [subtitle, setSubtitle] = useState("A tiny quest begins… choose wisely.");
  const lines = useMemo(
    () => [
      "It’s dangerous to go alone… take my heart.",
      "New Quest: Become my Valentine?",
      "Press START to accept romance.",
      "Rupees can’t buy this… only YES can.",
      "The Legend of You & Me begins here.",
    ],
    []
  );

  const [touch, setTouch] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // HUD
  const [hearts, setHearts] = useState(3);
  const [rupees, setRupees] = useState(0);
  const [hudPulse, setHudPulse] = useState<"heart" | "rupee" | null>(null);

  // Item get overlay
  const [itemGet, setItemGet] = useState(false);

  // Physics-ish state for NO flying away
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ vx: 0, vy: 0 });
  const pointer = useRef({ x: 0, y: 0, has: false });

  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTouch(detectTouchDevice());
    setSubtitle(lines[Math.floor(Math.random() * lines.length)]);
  }, [lines]);

  // init position after layout
  useEffect(() => {
    const arena = arenaRef.current;
    const noBtn = noBtnRef.current;
    if (!arena || !noBtn) return;

    const a = arena.getBoundingClientRect();
    const b = noBtn.getBoundingClientRect();

    const x = a.width * 0.68 - b.width / 2;
    const y = a.height * 0.64 - b.height / 2;

    pos.current = {
      x: clamp(x, 10, a.width - b.width - 10),
      y: clamp(y, 10, a.height - b.height - 10),
    };
    setRenderPos({ ...pos.current });
  }, []);

  // animation loop: NO accelerates away from pointer (desktop only)
  useEffect(() => {
    let raf = 0;

    const step = () => {
      const arena = arenaRef.current;
      const noBtn = noBtnRef.current;

      if (!arena || !noBtn || accepted || touch) {
        raf = requestAnimationFrame(step);
        return;
      }

      const a = arena.getBoundingClientRect();
      const b = noBtn.getBoundingClientRect();

      const p = pos.current;
      const v = vel.current;

      // center of NO button
      const cx = p.x + b.width / 2;
      const cy = p.y + b.height / 2;

      // repel when pointer inside arena
      if (pointer.current.has) {
        const dx = cx - pointer.current.x;
        const dy = cy - pointer.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const repelRadius = 210; // bigger = starts running earlier
        if (dist < repelRadius) {
          const ux = dx / dist;
          const uy = dy / dist;

          // stronger near cursor
          const strength = (1 - dist / repelRadius) ** 1.8;
          const accel = 2.4;

          v.vx += ux * strength * accel * 20;
          v.vy += uy * strength * accel * 20;
        }
      }

      // friction + cap speed
      v.vx *= 0.84;
      v.vy *= 0.84;

      const maxSpeed = 26;
      v.vx = clamp(v.vx, -maxSpeed, maxSpeed);
      v.vy = clamp(v.vy, -maxSpeed, maxSpeed);

      // update position
      p.x += v.vx;
      p.y += v.vy;

      // bounce within arena
      const pad = 10;
      const minX = pad;
      const minY = pad;
      const maxX = a.width - b.width - pad;
      const maxY = a.height - b.height - pad;

      if (p.x < minX) {
        p.x = minX;
        v.vx *= -0.78;
      } else if (p.x > maxX) {
        p.x = maxX;
        v.vx *= -0.78;
      }
      if (p.y < minY) {
        p.y = minY;
        v.vy *= -0.78;
      } else if (p.y > maxY) {
        p.y = maxY;
        v.vy *= -0.78;
      }

      setRenderPos({ x: p.x, y: p.y });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [accepted, touch]);

  function onArenaMove(e: React.MouseEvent) {
    if (touch || accepted) return;
    const arena = arenaRef.current;
    if (!arena) return;
    const a = arena.getBoundingClientRect();
    pointer.current = { x: e.clientX - a.left, y: e.clientY - a.top, has: true };
  }

  function onArenaLeave() {
    pointer.current.has = false;
  }

  function noClick() {
    if (accepted) return;
    if (touch) {
      setToast("🛡️ The NO option is sealed by ancient magic on mobile.");
      window.setTimeout(() => setToast(null), 1400);
      return;
    }
    setToast("🌫️ NO vanished into the Lost Woods.");
    window.setTimeout(() => setToast(null), 1400);

    // burst away
    vel.current.vx += (Math.random() - 0.5) * 34;
    vel.current.vy += (Math.random() - 0.5) * 34;
  }

  function yesClick() {
    if (accepted) return;

    // show item-get overlay first (then lock accepted)
    setItemGet(true);
    play8bitChime();

    // HUD rewards
    setRupees((r) => r + 100);
    setHearts((h) => clamp(h + 1, 0, 20));
    setHudPulse("rupee");
    window.setTimeout(() => setHudPulse("heart"), 180);
    window.setTimeout(() => setHudPulse(null), 520);

    window.setTimeout(() => {
      setItemGet(false);
      setAccepted(true);
    }, 1200);
  }

  return (
    <div className="min-h-[100svh] w-full overflow-hidden bg-[#05110b] text-emerald-100">
      {/* Zelda-ish retro background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(16,185,129,0.20),rgba(0,0,0,0.92))]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_bottom,rgba(0,0,0,0.0)_0px,rgba(255,255,255,0.12)_1px,rgba(0,0,0,0.0)_4px)] [background-size:100%_6px]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(16,185,129,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.14)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* HUD */}
      <div className="fixed left-0 right-0 top-0 z-30 px-3 pt-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl border border-emerald-400/20 bg-black/55 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-100/85">
            <span className="text-emerald-100/60">LIFE</span>
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-black/40 px-2 py-1 transition-transform",
                hudPulse === "heart" ? "scale-[1.08]" : "scale-100",
              ].join(" ")}
            >
              <PixelHeart size={18} className="drop-shadow-[0_0_8px_rgba(0,255,120,0.35)]" />
              <span className="text-emerald-100">{hearts}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-100/85">
            <span className="text-emerald-100/60">RUPEES</span>
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-black/40 px-2 py-1 transition-transform",
                hudPulse === "rupee" ? "scale-[1.08]" : "scale-100",
              ].join(" ")}
            >
              <PixelRupee size={16} className="drop-shadow-[0_0_8px_rgba(0,255,120,0.35)]" />
              <span className="text-emerald-100">{rupees}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Item Get Overlay */}
      {itemGet && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[92%] max-w-xl overflow-hidden rounded-3xl border border-yellow-300/25 bg-black/70 p-6 text-center shadow-[0_0_70px_rgba(250,204,21,0.10)]">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:100%_6px]" />
            <div className="relative">
              <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-yellow-100">
                ITEM GET
              </div>

              <div className="mx-auto flex items-center justify-center gap-3">
                <PixelTriforce className="drop-shadow-[0_0_18px_rgba(250,204,21,0.22)]" />
                <PixelHeart
                  size={54}
                  color="rgb(0,255,120)"
                  className="drop-shadow-[0_0_18px_rgba(0,255,120,0.40)]"
                />
                <PixelTriforce className="drop-shadow-[0_0_18px_rgba(250,204,21,0.22)]" />
              </div>

              <div className="mt-4 font-mono text-2xl font-bold text-yellow-100">
                GREEN HEART ACQUIRED!
              </div>
              <p className="mt-2 font-mono text-[12px] text-emerald-100/80">
                You feel stronger… and significantly more romantic.
              </p>

              {/* sparkles */}
              <div className="mt-5 flex items-center justify-center gap-3 opacity-90">
                <FairySpark className="animate-bounce" />
                <FairySpark className="animate-bounce [animation-delay:120ms]" />
                <FairySpark className="animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-12 pt-24">
        <div className="relative w-full rounded-3xl border border-emerald-400/25 bg-black/45 p-6 shadow-[0_0_70px_rgba(16,185,129,0.14)] backdrop-blur md:p-10">
          {/* Retro Zelda icons around card */}
          <PixelRupee className="absolute -left-3 -top-3 opacity-80 drop-shadow-[0_0_12px_rgba(0,255,120,0.35)]" />
          <PixelBomb className="absolute -right-3 -top-3 opacity-80" />
          <PixelTriforce className="absolute left-1/2 -top-6 -translate-x-1/2 opacity-90 drop-shadow-[0_0_18px_rgba(250,204,21,0.25)]" />
          <FairySpark className="absolute -left-2 bottom-10 opacity-80" />
          <PixelHeart
            className="absolute -right-2 bottom-10 opacity-90 drop-shadow-[0_0_16px_rgba(0,255,120,0.45)]"
            color="rgb(0,255,120)"
          />

          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-[10px] tracking-[0.25em] text-yellow-100">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
              LEGENDARY VALENTINE QUEST
            </div>

            <h1 className="mt-5 text-balance font-mono text-3xl font-bold text-emerald-100 md:text-5xl">
              WILL YOU BE MY VALENTINE?
            </h1>
            <p className="mt-2 font-mono text-xs text-emerald-100/75 md:text-sm">
              {subtitle}
            </p>
          </div>

          {accepted ? (
            <div className="mt-8 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-6 text-center">
              <div className="font-mono text-2xl md:text-3xl text-emerald-100">✅ QUEST ACCEPTED</div>
              <p className="mt-2 font-mono text-emerald-100/80">
                You obtained: <span className="text-emerald-100">GREEN HEART</span> 💚
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 font-mono text-[11px]">
                <span className="rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1">+100 RUPEES</span>
                <span className="rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1">+1 FAIRY</span>
                <span className="rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1">SAVE: SUCCESS</span>
              </div>

              <button
                onClick={() => {
                  setAccepted(false);
                  setRupees(0);
                  setHearts(3);
                }}
                className="mt-6 rounded-xl border border-emerald-400/25 bg-black/55 px-4 py-2 font-mono text-xs text-emerald-100/85 hover:bg-black/75"
              >
                RESET QUEST
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 text-center font-mono text-[11px] text-emerald-100/65">
                {touch ? "MOBILE: NO is sealed 🔒" : "DESKTOP: NO will FLY away from your cursor 🏹"}
              </div>

              <div
                ref={arenaRef}
                onMouseMove={onArenaMove}
                onMouseLeave={onArenaLeave}
                className="relative mt-6 h-[360px] w-full overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/30 p-4"
              >
                {/* YES button */}
                <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={yesClick}
                    className="group relative rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-8 py-4 font-mono text-lg font-bold text-yellow-100 shadow-[0_0_36px_rgba(250,204,21,0.16)] transition-transform active:scale-[0.98] md:hover:scale-[1.02]"
                  >
                    <span className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.35),transparent_60%)]" />
                    YES <span className="text-yellow-100/70 text-xs">(TAKE)</span>
                  </button>
                </div>

                {/* NO button (flies away) */}
                <button
                  ref={noBtnRef}
                  onClick={noClick}
                  style={{ transform: `translate(${renderPos.x}px, ${renderPos.y}px)` }}
                  className="absolute left-0 top-0 select-none rounded-2xl border border-emerald-400/20 bg-black/60 px-7 py-3 font-mono text-base font-bold text-emerald-100/85 shadow-[0_0_26px_rgba(0,0,0,0.35)]"
                >
                  NO
                </button>

                {/* Toast */}
                <div className="pointer-events-none absolute bottom-4 left-1/2 w-[94%] -translate-x-1/2 text-center">
                  {toast ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-black/75 px-4 py-2 font-mono text-[11px] text-emerald-100 backdrop-blur">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.95)]" />
                      {toast}
                    </div>
                  ) : (
                    <div className="font-mono text-[11px] text-emerald-100/50">
                      Hint: You can’t “NO” your way out of destiny.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-[11px] text-emerald-100/70">
                <span className="rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1">HUD</span>
                <span className="rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1">ITEM GET</span>
                <span className="rounded-full border border-emerald-400/20 bg-black/40 px-3 py-1">8-BIT CHIME</span>
              </div>
            </>
          )}
        </div>

        <footer className="mt-8 text-center font-mono text-[10px] text-emerald-100/35">
          Zelda-inspired parody styling — not affiliated with Nintendo.
        </footer>
      </main>
    </div>
  );
}