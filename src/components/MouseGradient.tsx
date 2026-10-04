"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    vUv.y = 1.0 - vUv.y;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_isTouch;
  uniform float u_intensity;
  uniform float u_debug;
  uniform float u_isHero;

  // Pseudo-random hash function
  float hash(vec2 p) { 
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123); 
  }

  // Value noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Wide soft blob falloff helper: guaranteed inner < outer for standards-compliant GLSL
  float getFalloff(vec2 pos, vec2 center, float radius, float softness) {
    float d = distance(pos, center);
    float inner = max(0.0, radius - softness);
    float outer = radius + softness;
    return 1.0 - smoothstep(inner, outer, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 aspectUv = uv;
    aspectUv.x *= aspect;

    // Slow time for 20-30s loops
    float t = u_time * 0.04;

    // Allowed palette colours strictly:
    vec3 bg             = vec3(0.0431, 0.0431, 0.0431); // #0B0B0B base
    vec3 c_wine         = vec3(0.2902, 0.0392, 0.0627); // #4A0A10 wine
    vec3 c_maroon       = vec3(0.4784, 0.0667, 0.0941); // #7A1118 maroon
    vec3 c_antique_gold = vec3(0.5412, 0.4157, 0.1961); // #8A6A32 antique gold
    vec3 c_gold         = vec3(0.8314, 0.6588, 0.2941); // #D4A84B cursor glow
    vec3 c_champagne    = vec3(0.9098, 0.8392, 0.6588); // #E8D6A8 champagne highlight

    // Debug test colors if requested via flag
    if (u_debug > 0.5) {
      c_wine         = vec3(0.0, 1.0, 1.0); // cyan
      c_maroon       = vec3(1.0, 0.0, 1.0); // magenta
      c_antique_gold = vec3(1.0, 1.0, 0.0); // yellow
      c_champagne    = vec3(0.0, 1.0, 0.0); // green
    }

    // Intensity scaling: safely scale mix strengths while preventing blowout
    float intensityScale = clamp(u_intensity, 0.5, 1.25);

    // Max mix strengths: ~0.75 for maroon, 0.55 for antique gold, 0.35 for cursor glow
    float mixWine      = clamp(0.55 * intensityScale, 0.0, 0.68);
    float mixMaroon    = clamp(0.65 * intensityScale, 0.0, 0.75);
    float mixGold      = clamp(0.48 * intensityScale, 0.0, 0.55);
    float mixChampagne = clamp(0.20 * intensityScale, 0.0, 0.25);
    float mixCursor    = clamp(0.30 * intensityScale, 0.0, 0.35);

    // 4-5 blob positions on slow sine / noise paths (20-30s cycles)
    vec2 b1 = vec2(sin(t * 0.9)  * 0.30 + 0.5, cos(t * 0.7)  * 0.25 + 0.5); // wine
    vec2 b2 = vec2(cos(t * 1.1)  * 0.32 + 0.5, sin(t * 0.8)  * 0.28 + 0.5); // maroon
    vec2 b3 = vec2(sin(t * 0.65) * 0.28 + 0.5, cos(t * 1.0)  * 0.30 + 0.5); // antique gold
    vec2 b4 = vec2(cos(t * 0.75) * 0.26 + 0.5, sin(t * 0.6)  * 0.25 + 0.5); // deep wine
    vec2 b5 = vec2(sin(t * 0.45) * 0.22 + 0.5, cos(t * 0.55) * 0.22 + 0.5); // champagne highlight

    if (u_isHero > 0.5) {
      // Hero mode: Place maroon and antique gold mostly on right half and centre around video stack
      // Left third (x < 0.35) remains deep dark velvet #0B0B0B behind headline
      b1 = vec2(sin(t * 0.9)  * 0.12 + 0.58, cos(t * 0.7)  * 0.22 + 0.48); // wine (center-right)
      b2 = vec2(cos(t * 1.1)  * 0.14 + 0.72, sin(t * 0.8)  * 0.24 + 0.50); // maroon (around stack)
      b3 = vec2(sin(t * 0.65) * 0.12 + 0.78, cos(t * 1.0)  * 0.24 + 0.52); // antique gold (around stack)
      b4 = vec2(cos(t * 0.75) * 0.12 + 0.82, sin(t * 0.6)  * 0.20 + 0.36); // deep wine (upper right)
      b5 = vec2(sin(t * 0.45) * 0.10 + 0.74, cos(t * 0.55) * 0.16 + 0.50); // champagne highlight
    }

    b1.x *= aspect;
    b2.x *= aspect;
    b3.x *= aspect;
    b4.x *= aspect;
    b5.x *= aspect;

    // Cursor coordinates & swirl distortion
    vec2 m = u_mouse;
    m.x *= aspect;
    vec2 diff = aspectUv - m;
    float dCursor = length(diff);

    // Gentle pinch/swirl distortion around cursor (radius ~ 0.2)
    float swirl = exp(-dCursor * 5.0);
    vec2 distortedUv = aspectUv + vec2(-diff.y, diff.x) * swirl * 0.12;
    float n = noise(distortedUv * 3.5 + t);

    // Sequential blending with mix() over #0B0B0B base - NEVER add (+) blob colours!
    vec3 col = bg;

    // Blob 1: Wine (#4A0A10)
    float f1 = getFalloff(aspectUv, b1, 0.38, 0.45);
    col = mix(col, c_wine, clamp(f1 * mixWine, 0.0, 0.68));

    // Blob 2: Maroon (#7A1118)
    float f2 = getFalloff(aspectUv, b2, 0.42, 0.48);
    col = mix(col, c_maroon, clamp(f2 * mixMaroon, 0.0, 0.75));

    // Blob 3: Antique Gold (#8A6A32)
    float f3 = getFalloff(aspectUv, b3, 0.32, 0.40);
    col = mix(col, c_antique_gold, clamp(f3 * mixGold, 0.0, 0.55));

    // Blob 4: Deep Wine (#4A0A10) secondary depth blob
    float f4 = getFalloff(aspectUv, b4, 0.34, 0.44);
    col = mix(col, c_wine, clamp(f4 * mixWine * 0.85, 0.0, 0.60));

    // Blob 5: Rare small Champagne highlight (#E8D6A8)
    float f5 = getFalloff(aspectUv, b5, 0.10, 0.22);
    col = mix(col, c_champagne, clamp(f5 * mixChampagne, 0.0, 0.25));

    // Cursor glow: Warm Gold (#D4A84B)
    float fCursor = 1.0 - smoothstep(0.0, 0.28, dCursor);
    col = mix(col, c_gold, clamp(fCursor * mixCursor, 0.0, 0.35));

    // Small champagne highlight at cursor center (tiny core)
    float fCore = 1.0 - smoothstep(0.0, 0.08, dCursor);
    col = mix(col, c_champagne, clamp(fCore * 0.12 * intensityScale, 0.0, 0.12));

    // Luminance cap: never exceed champagne tone #E8D6A8 (no pure white anywhere)
    float maxLum = dot(c_champagne, vec3(0.299, 0.587, 0.114));
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    if (lum > maxLum && u_debug < 0.5) {
      col *= (maxLum / lum);
    }

    // Velvet noise modulation
    col *= (0.92 + 0.08 * n);

    // Fine film grain at 0.04-0.05
    float grain = (hash(uv * 133.0 + fract(u_time * 19.371)) - 0.5) * 0.045;
    col = clamp(col + grain, 0.0, 1.0);

    // Final safety luminance clamp after film grain
    float finalLum = dot(col, vec3(0.299, 0.587, 0.114));
    if (finalLum > maxLum && u_debug < 0.5) {
      col *= (maxLum / finalLum);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Program link error:", gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function MouseGradient({ 
  mouseX, 
  mouseY, 
  isHovering,
  intensity = 1.0,
  debug = false,
  variant = "default",
  className
}: { 
  mouseX?: number; 
  mouseY?: number; 
  isHovering?: boolean;
  intensity?: number;
  debug?: boolean;
  variant?: "default" | "hero";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  // Animation & WebGL state
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isRunningRef = useRef(false);
  const isVisibleRef = useRef(true);
  
  // Performance scaling
  const scaleRef = useRef(typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1);
  const badFramesRef = useRef(0);
  
  // Mouse lerping
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });
  const isTouchRef = useRef(false);
  const isHoveringInternalRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  useEffect(() => {
    if (typeof mouseX === "number" && typeof mouseY === "number") {
      targetMouseRef.current = { x: mouseX, y: mouseY };
    }
    if (typeof isHovering === "boolean") {
      isHoveringInternalRef.current = isHovering;
    }
  }, [mouseX, mouseY, isHovering]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
    } catch {
      setHasWebGL(false);
      return;
    }

    if (!gl) {
      setHasWebGL(false);
      return;
    }
    glRef.current = gl;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    if (!program) {
      setHasWebGL(false);
      return;
    }
    programRef.current = program;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uIsTouch = gl.getUniformLocation(program, "u_isTouch");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");
    const uDebug = gl.getUniformLocation(program, "u_debug");
    const uIsHero = gl.getUniformLocation(program, "u_isHero");

    // Passive pointer listeners directly on host element to avoid React re-renders
    const hostEl = canvas.closest("section") || canvas.parentElement;
    const handleHostPointerMove = (e: PointerEvent) => {
      if (!hostEl || isTouchRef.current) return;
      const rect = hostEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetMouseRef.current = { x, y };
      isHoveringInternalRef.current = true;
    };
    const handleHostPointerLeave = () => {
      isHoveringInternalRef.current = false;
    };

    if (hostEl) {
      hostEl.addEventListener("pointermove", handleHostPointerMove, { passive: true });
      hostEl.addEventListener("pointerleave", handleHostPointerLeave, { passive: true });
    }

    const startLoop = () => {
      if (isRunningRef.current || !isVisibleRef.current) return;
      isRunningRef.current = true;
      lastTimeRef.current = performance.now();
      frameRef.current = requestAnimationFrame(render);
    };

    const stopLoop = () => {
      isRunningRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };

    const render = (time: number) => {
      if (!isRunningRef.current || !isVisibleRef.current) {
        isRunningRef.current = false;
        return;
      }

      // Dynamic quality adjustment if frame time > 20ms
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      if (dt > 20) {
        badFramesRef.current++;
        if (badFramesRef.current > 30 && scaleRef.current > 0.5) {
          scaleRef.current *= 0.8;
          badFramesRef.current = 0;
          resize();
        }
      } else {
        badFramesRef.current = Math.max(0, badFramesRef.current - 1);
      }

      timeRef.current += 0.01;

      // Update resolution uniform
      if (canvas.width !== canvas.clientWidth * scaleRef.current || canvas.height !== canvas.clientHeight * scaleRef.current) {
        resize();
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      // Lerp mouse coordinates
      if (isTouchRef.current) {
        currentMouseRef.current.x = 0.5 + Math.sin(timeRef.current * 0.4) * 0.25;
        currentMouseRef.current.y = 0.5 + Math.cos(timeRef.current * 0.3) * 0.25;
      } else {
        if (!isHoveringInternalRef.current) {
          targetMouseRef.current = { x: 0.5, y: 0.5 };
        }
        currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.08;
        currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.08;
      }

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, timeRef.current);
      gl.uniform2f(uMouse, currentMouseRef.current.x, 1.0 - currentMouseRef.current.y);
      gl.uniform1f(uIsTouch, isTouchRef.current ? 1.0 : 0.0);
      gl.uniform1f(uIntensity, intensity);
      gl.uniform1f(uDebug, process.env.NODE_ENV !== "production" && debug ? 1.0 : 0.0);
      gl.uniform1f(uIsHero, variant === "hero" ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      setIsReady(true);
      frameRef.current = requestAnimationFrame(render);
    };

    const resize = () => {
      if (!canvas) return;
      canvas.width = Math.max(1, canvas.clientWidth * scaleRef.current);
      canvas.height = Math.max(1, canvas.clientHeight * scaleRef.current);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // IntersectionObserver to pause WebGL when scrolled away
    const io = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView !== isVisibleRef.current) {
          isVisibleRef.current = inView;
          if (inView) {
            startLoop();
          } else {
            stopLoop();
          }
        }
      },
      { threshold: 0 }
    );
    if (hostEl) io.observe(hostEl);

    // Tab visibility listener
    const onVisChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        stopLoop();
      } else {
        if (hostEl) {
          const rect = hostEl.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            isVisibleRef.current = true;
            startLoop();
          }
        }
      }
    };
    document.addEventListener("visibilitychange", onVisChange);

    // Start render loop
    startLoop();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      if (hostEl) {
        io.disconnect();
        hostEl.removeEventListener("pointermove", handleHostPointerMove);
        hostEl.removeEventListener("pointerleave", handleHostPointerLeave);
      }
      document.removeEventListener("visibilitychange", onVisChange);
      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current);
      }
    };
  }, [debug, intensity, variant]);

  const staticGradient = variant === "hero"
    ? "radial-gradient(ellipse at 70% 50%, #4A0A10 0%, #0B0B0B 75%)"
    : "radial-gradient(circle at 50% 50%, #4A0A10 0%, #0B0B0B 75%)";

  return (
    <div className={cn("absolute inset-0 w-full h-full pointer-events-none overflow-hidden", className)}>
      {/* Seamless static CSS gradient fallback (prevents any flash or shift before WebGL loads) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: staticGradient }}
        aria-hidden="true"
      />
      {hasWebGL && (
        <canvas 
          ref={canvasRef} 
          className={cn(
            "absolute inset-0 w-full h-full block pointer-events-none transition-opacity duration-700 ease-out",
            isReady ? "opacity-100" : "opacity-0"
          )} 
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default MouseGradient;
