"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Petals.tsx / components/Petals.jsx – Golden Rose-Petal Ambient Layer
 *  Zero-dependency 2D canvas layer.
 *  Pre-renders 8 golden petal sprites to offscreen canvases for 60 fps drawImage.
 *  Ambient only (no cursor interaction).
 * ───────────────────────────────────────────────────────────────────────────── */

/* Global tracking of active visible instances to scale particle load */
let globalVisibleInstances = 0;

/* === Types ================================================================ */
interface PetalSprite {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

interface Petal {
  x: number;
  y: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  scalePhase: number;
  scaleSpeed: number;
  sway: number;
  swaySpeed: number;
  swayPhase: number;
  sprite: number;
  depth: number; // 0 = far, 1 = mid, 2 = near
  alpha: number;
  size: number;
}

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  wobblePhase: number;
  wobbleSpeed: number;
  radius: number;
  color: string;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export interface PetalsProps {
  petalCount?: number;
  dustCount?: number;
  className?: string;
  /** Section identifier for dev logging and telemetry */
  sectionId?: string;
}

/* === Color Palette ======================================================== */
// Antique gold base, rich gold middle, champagne edge with 60% opacity
const GOLDEN_VARIANTS: [string, string, string][] = [
  ["#8A6A32", "#D4A84B", "rgba(232, 214, 168, 0.60)"],
  ["#82632E", "#CD9F43", "rgba(228, 208, 160, 0.60)"],
  ["#917036", "#D9AD52", "rgba(236, 219, 175, 0.60)"],
  ["#886730", "#D1A447", "rgba(230, 211, 164, 0.60)"],
  ["#8F6D34", "#D7AA4F", "rgba(234, 216, 171, 0.60)"],
];

// About 1 in 6 petals is deep red-gold accent (#7A1118 blending into #D4A84B) echoing logo
const RED_GOLD_VARIANTS: [string, string, string][] = [
  ["#7A1118", "#9E5528", "rgba(212, 168, 75, 0.65)"],
  ["#6E1016", "#914E24", "rgba(202, 158, 68, 0.65)"],
];

/* === Pre-render golden petal sprites ====================================== */
function buildPetalSprite(
  baseColor: string,
  midColor: string,
  edgeColor: string,
  baseLength: number,
  isDebug: boolean = false
): PetalSprite {
  const length = isDebug ? baseLength * 1.5 : baseLength;
  const h = Math.ceil(length);
  const w = Math.ceil(length * 0.7);
  const padding = 6;
  const canvasW = w + padding * 2;
  const canvasH = h + padding * 2;

  const c = document.createElement("canvas");
  c.width = canvasW;
  c.height = canvasH;
  const ctx = c.getContext("2d")!;

  const cx = canvasW / 2;
  const cy = canvasH / 2;

  ctx.save();
  ctx.translate(cx, cy);

  // Soft rose petal shape: rounded teardrop with a slight notch at the top
  const sw = w * 0.48;
  const sh = h * 0.48;
  const notch = h * 0.08;

  ctx.beginPath();
  // Bottom tip
  ctx.moveTo(0, sh);
  // Curve up right
  ctx.bezierCurveTo(sw * 0.72, sh * 0.62, sw, sh * 0.08, sw * 0.6, -sh * 0.74);
  // Top right towards notch
  ctx.bezierCurveTo(sw * 0.38, -sh * 0.98, notch * 0.7, -sh + notch * 0.5, 0, -sh + notch);
  // Center notch to top left
  ctx.bezierCurveTo(-notch * 0.7, -sh + notch * 0.5, -sw * 0.38, -sh * 0.98, -sw * 0.6, -sh * 0.74);
  // Curve down left to bottom tip
  ctx.bezierCurveTo(-sw, sh * 0.08, -sw * 0.72, sh * 0.62, 0, sh);
  ctx.closePath();

  if (isDebug) {
    // Bright magenta in debug mode
    ctx.fillStyle = "#FF00FF";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else {
    // Gradient fill: base antique gold, middle gold, edge champagne at 60% opacity
    const grad = ctx.createLinearGradient(0, sh, 0, -sh);
    grad.addColorStop(0, baseColor);
    grad.addColorStop(0.5, midColor);
    grad.addColorStop(1, edgeColor);
    ctx.fillStyle = grad;
    ctx.fill();

    // Faint darker inner fold line (#6B4F20 at 40%) so the petal has form
    ctx.beginPath();
    ctx.moveTo(0, sh * 0.85);
    ctx.bezierCurveTo(sw * 0.15, sh * 0.3, sw * 0.1, -sh * 0.2, 0, -sh * 0.6);
    ctx.strokeStyle = "rgba(107, 79, 32, 0.40)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Thin lighter highlight line along right edge (#E8D6A8 / pale champagne)
    ctx.beginPath();
    ctx.moveTo(sw * 0.32, -sh * 0.5);
    ctx.bezierCurveTo(sw * 0.52, -sh * 0.1, sw * 0.42, sh * 0.3, sw * 0.1, sh * 0.58);
    ctx.strokeStyle = "rgba(255, 248, 225, 0.45)";
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }

  ctx.restore();

  return { canvas: c, width: canvasW, height: canvasH };
}

function buildSpriteAtlas(isDebug: boolean): PetalSprite[] {
  const sprites: PetalSprite[] = [];
  // 5 golden variants (lengths 14px to 22px)
  const sizes = [14, 18, 22, 16, 20];
  for (let i = 0; i < 5; i++) {
    const [base, mid, edge] = GOLDEN_VARIANTS[i % GOLDEN_VARIANTS.length];
    sprites.push(buildPetalSprite(base, mid, edge, sizes[i], isDebug));
  }
  // 2 red-gold accent variants (about 1 in 6 petals)
  sprites.push(buildPetalSprite(RED_GOLD_VARIANTS[0][0], RED_GOLD_VARIANTS[0][1], RED_GOLD_VARIANTS[0][2], 16, isDebug));
  sprites.push(buildPetalSprite(RED_GOLD_VARIANTS[1][0], RED_GOLD_VARIANTS[1][1], RED_GOLD_VARIANTS[1][2], 20, isDebug));
  return sprites;
}

/* === Petal factory ======================================================= */
function spawnPetal(
  w: number,
  h: number,
  spriteCount: number,
  placeAtTop: boolean,
  isDebug: boolean
): Petal {
  // 3 depth layers: 0 = far, 1 = mid, 2 = near
  const rand = Math.random();
  const depth = rand < 0.35 ? 0 : rand < 0.7 ? 1 : 2;

  // Near: larger, faster, sharper (0.80 - 0.95 alpha)
  // Mid:  medium (0.65 - 0.80 alpha)
  // Far:  small, slower (0.45 - 0.60 alpha, 1.2px blur)
  const depthAlphas = [
    0.48 + Math.random() * 0.12,
    0.65 + Math.random() * 0.15,
    0.80 + Math.random() * 0.15,
  ];
  const depthSpeed = [0.70, 0.88, 1.12][depth];
  const depthSize = [0.72, 0.90, 1.12][depth];

  // 1 in 6 chance for red-gold accent petal (sprites 5 or 6)
  const isRedGold = Math.random() < 0.166;
  let sprite = isRedGold
    ? 5 + Math.floor(Math.random() * 2)
    : Math.floor(Math.random() * 5);
  sprite = Math.min(sprite, spriteCount - 1);

  const alpha = isDebug ? 1.0 : depthAlphas[depth];

  return {
    x: Math.random() * w,
    // Randomised start offsets so petals never fall in sync
    y: placeAtTop ? -20 - Math.random() * 50 : Math.random() * h,
    vy: (15 + Math.random() * 20) * depthSpeed, // 15-35 px/s range
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (0.20 + Math.random() * 0.50) * (Math.random() < 0.5 ? 1 : -1),
    scalePhase: Math.random() * Math.PI * 2,
    scaleSpeed: 0.55 + Math.random() * 0.75,
    sway: 16 + Math.random() * 24,
    swaySpeed: 0.30 + Math.random() * 0.40,
    swayPhase: Math.random() * Math.PI * 2,
    sprite,
    depth,
    alpha,
    size: depthSize,
  };
}

/* === Gold Dust factory =================================================== */
function spawnDust(w: number, h: number): Dust {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 4,
    vy: 3 + Math.random() * 5, // 3-8 px/s drift
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.8 + Math.random() * 1.2,
    radius: 0.75 + Math.random() * 0.5, // 1-2px diameter
    color: Math.random() < 0.5 ? "#D4A84B" : "#E8D6A8",
    baseAlpha: 0.40 + Math.random() * 0.30, // 40-70% opacity
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: (Math.PI * 2) / (2.0 + Math.random() * 3.0), // 2-5s pulse cycle
  };
}

// Singleton cached sprite atlas across all Petals instances
let cachedSprites: PetalSprite[] | null = null;
let cachedDebugSprites: PetalSprite[] | null = null;

function getSpriteAtlas(isDebug: boolean): PetalSprite[] {
  if (isDebug) {
    if (!cachedDebugSprites) cachedDebugSprites = buildSpriteAtlas(true);
    return cachedDebugSprites;
  }
  if (!cachedSprites) cachedSprites = buildSpriteAtlas(false);
  return cachedSprites;
}

/* === Component =========================================================== */
export function Petals({
  petalCount = 6,
  dustCount = 3,
  className = "",
  sectionId = "section",
}: PetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spritesRef = useRef<PetalSprite[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const dustsRef = useRef<Dust[]>([]);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const [isDebug, setIsDebug] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check debug flag on client (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsDebug(params.get("debugPetals") === "1");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* Reduced motion check */
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mql.addEventListener("change", onMotionChange);

    /* Mobile count scaling: ~60% of desktop count */
    const isMobile = window.innerWidth < 768;
    const effectivePetalCount = isMobile
      ? Math.max(1, Math.round(petalCount * 0.6))
      : petalCount;
    const effectiveDustCount = isMobile
      ? Math.max(1, Math.round(dustCount * 0.6))
      : dustCount;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // Reuse singleton sprite atlas
    spritesRef.current = getSpriteAtlas(isDebug);
    const sprites = spritesRef.current;

    let initialized = false;

    const initParticles = (w: number, h: number) => {
      if (w <= 10 || h <= 10) return;
      petalsRef.current = Array.from({ length: effectivePetalCount }, () =>
        spawnPetal(w, h, sprites.length, false, isDebug)
      );
      dustsRef.current = Array.from({ length: effectiveDustCount }, () =>
        spawnDust(w, h)
      );
      initialized = true;

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[Petals] Mounted in "${sectionId}": ${w}x${h}px | petals: ${effectivePetalCount}, dust: ${effectiveDustCount}, dpr: ${dpr}`
        );
      }
    };

    /* Resize handling without forced synchronous reflow */
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w > 0 && h > 0) {
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        sizeRef.current = { w: canvas.width, h: canvas.height };

        if (!initialized && canvas.width > 20 && canvas.height > 20) {
          initParticles(canvas.width, canvas.height);
        }
      }
    });
    ro.observe(canvas);

    /* Animation Loop Controls */
    let lastTime = performance.now();
    let isRunning = false;

    const startLoop = () => {
      if (isRunning || !visibleRef.current || reducedMotionRef.current) return;
      isRunning = true;
      lastTime = performance.now();
      rafRef.current = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      isRunning = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    const frame = (now: number) => {
      if (!isRunning || !visibleRef.current || reducedMotionRef.current) {
        isRunning = false;
        return;
      }

      rafRef.current = requestAnimationFrame(frame);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timeRef.current += dt;

      const w = sizeRef.current.w;
      const h = sizeRef.current.h;
      if (w === 0 || h === 0) return;

      if (!initialized) {
        initParticles(w, h);
      }

      ctx.clearRect(0, 0, w, h);

      // Performance: If more than 3 instances are visible at once, reduce count by 30%
      const drawLimit = globalVisibleInstances > 3
        ? Math.ceil(petalsRef.current.length * 0.7)
        : petalsRef.current.length;

      /* Draw Petals */
      for (let i = 0; i < drawLimit; i++) {
        const p = petalsRef.current[i];
        if (!reducedMotionRef.current) {
          // Falling downward + horizontal sway
          p.y += p.vy * dt * dpr;
          p.x += Math.sin(timeRef.current * p.swaySpeed + p.swayPhase) * p.sway * dt * dpr;

          // 2D Rotation & 3D tumble phase
          p.rotation += p.rotSpeed * dt;
          p.scalePhase += p.scaleSpeed * dt;

          // Recycle petal to the top when it leaves bottom
          if (p.y > h + 30 * dpr) {
            const recycled = spawnPetal(w, h, sprites.length, true, isDebug);
            Object.assign(p, recycled);
          }
        }

        const sp = sprites[p.sprite];
        if (!sp) continue;

        // 3D tumble: scaleX oscillates between ~0.35 and 1.0
        const scaleX = 0.35 + 0.65 * Math.abs(Math.cos(p.scalePhase));
        const s = p.size * dpr;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scaleX * s, s);

        // Far layer: 1.2px blur for depth
        if (p.depth === 0 && !isDebug) {
          ctx.filter = "blur(1.2px)";
        }

        ctx.drawImage(sp.canvas, -sp.width / 2, -sp.height / 2, sp.width, sp.height);

        if (p.depth === 0 && !isDebug) {
          ctx.filter = "none";
        }

        ctx.restore();
      }

      /* Draw Gold Dust */
      const dustLimit = globalVisibleInstances > 3
        ? Math.ceil(dustsRef.current.length * 0.7)
        : dustsRef.current.length;

      for (let i = 0; i < dustLimit; i++) {
        const d = dustsRef.current[i];
        if (!reducedMotionRef.current) {
          d.y += d.vy * dt * dpr;
          d.x += d.vx * dt * dpr + Math.sin(timeRef.current * d.wobbleSpeed + d.wobblePhase) * 1.5 * dt * dpr;
          d.pulsePhase += d.pulseSpeed * dt;

          // Recycle dust
          if (d.y > h + 10 * dpr) {
            Object.assign(d, spawnDust(w, h));
            d.y = -5 * dpr;
          }
        }

        // Twinkling between 40% and 70% opacity over 2-5s
        const twinkle = d.baseAlpha + Math.sin(d.pulsePhase) * 0.15;
        const alpha = isDebug ? 1.0 : Math.max(0.35, Math.min(twinkle, 0.75));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = isDebug ? "#00FF00" : d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, (isDebug ? 2.5 : d.radius) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* prefers-reduced-motion: draw one static frame and stop */
      if (reducedMotionRef.current) {
        stopLoop();
      }
    };

    /* IntersectionObserver on host section with 0.3s fade */
    const targetSection = canvas.closest("section") || canvas.parentElement || canvas;
    const io = new IntersectionObserver(
      ([entry]) => {
        const isInter = entry.isIntersecting;
        if (isInter !== visibleRef.current) {
          visibleRef.current = isInter;
          setIsVisible(isInter);
          if (isInter) {
            globalVisibleInstances++;
            startLoop();
          } else {
            globalVisibleInstances = Math.max(0, globalVisibleInstances - 1);
            stopLoop();
          }
        }
      },
      { threshold: 0 }
    );
    io.observe(targetSection);

    /* Visibilitychange (pause when tab is hidden) */
    const onVisChange = () => {
      if (document.hidden) {
        visibleRef.current = false;
        setIsVisible(false);
        stopLoop();
      } else {
        const rect = targetSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          visibleRef.current = true;
          setIsVisible(true);
          startLoop();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
      mql.removeEventListener("change", onMotionChange);
      if (visibleRef.current) {
        globalVisibleInstances = Math.max(0, globalVisibleInstances - 1);
      }
    };
  }, [petalCount, dustCount, isDebug, sectionId]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={isDebug ? { outline: "2px solid #00FF00", zIndex: 9999 } : undefined}
      aria-hidden="true"
    />
  );
}

export default Petals;
