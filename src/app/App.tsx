// App.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

/**
 * Visual theme mapping (Option A):
 * - Background         -> bg-background (Creamy White #F5F0E1)
 * - Animated text      -> text-accent (Soft Citrus Yellow #F6E7B4)
 * - Title + borders    -> text-primary / border-primary (Warm Sand #D9C6AD)
 * - Perfume lid pieces -> bg-primary (Warm Sand #D9C6AD)
 */

export default function App() {
  // Text to orbit around the square
  const text = "Bergamot  •  Jasmine  •  Musk  •  ";

  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    setCharacters(text.split(""));
  }, [text]);

  // Viewport-based responsive math
  const { vw, vh } =
    typeof window !== "undefined"
      ? { vw: window.innerWidth, vh: window.innerHeight }
      : { vw: 1080, vh: 1920 };

  const scale = vw / 1080; // baseline 1080px
  const squareSize = 340 * scale;

  // Center point (slightly above middle for layout balance)
  const centerX = vw / 2;
  const centerY = vh * 0.458;

  // Perfume lid dimensions/positions (relative to center + square)
  const lid = useMemo(() => {
    const topOfSquare = centerY - squareSize / 2;
    const lidWidth = 160 * scale;
    const lidDepth = 18 * scale;
    const lidBodyHeight = 54 * scale;
    const lidRadius = lidDepth / 2;

    return {
      // Top rounded cap
      cap: {
        x: centerX - lidWidth / 2,
        y: topOfSquare - (lidDepth + 24 * scale),
        w: lidWidth,
        h: lidDepth,
        r: lidRadius,
      },
      // Lid body (rectangle)
      body: {
        x: centerX - (lidWidth - 40 * scale) / 2,
        y: topOfSquare - (lidBodyHeight + 8 * scale),
        w: lidWidth - 40 * scale,
        h: lidBodyHeight,
        r: 8 * scale,
      },
      // Small bottom curve/accent sitting right above the square
      base: {
        x: centerX - (lidWidth - 72 * scale) / 2,
        y: topOfSquare - (12 * scale),
        w: lidWidth - 72 * scale,
        h: 10 * scale,
        r: 12 * scale,
      },
      // A thin highlight line on the lid (subtle)
      highlight: {
        x: centerX - (lidWidth - 42 * scale) / 2,
        y: topOfSquare - (lidBodyHeight + 2 * scale),
        w: lidWidth - 42 * scale,
        h: 2,
      },
    };
  }, [centerX, centerY, scale, squareSize]);

  // Compute character positions along the square
  const perimeter = squareSize * 4;

  const getCharacterPosition = (index: number, offset: number) => {
    const totalChars = Math.max(characters.length, 1);
    const spacing = perimeter / totalChars;
    const position = (index * spacing + offset) % perimeter;

    const half = squareSize / 2;
    let x = 0;
    let y = 0;
    let rotation = 0;

    // Top side (left → right)
    if (position < squareSize) {
      x = centerX - half + position;
      y = centerY - half;
      rotation = 0;
    }
    // Right side (top → bottom)
    else if (position < squareSize * 2) {
      x = centerX + half;
      y = centerY - half + (position - squareSize);
      rotation = 90;
    }
    // Bottom side (right → left)
    else if (position < squareSize * 3) {
      x = centerX + half - (position - squareSize * 2);
      y = centerY + half;
      rotation = 180;
    }
    // Left side (bottom → top)
    else {
      x = centerX - half;
      y = centerY + half - (position - squareSize * 3);
      rotation = 270;
    }

    return { x, y, rotation };
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground antialiased">
      {/* --- Central square guide (border uses Warm Sand via border-primary) --- */}
      <div
        className="absolute rounded-lg border border-primary shadow-sm"
        style={{
          width: squareSize,
          height: squareSize,
          left: centerX - squareSize / 2,
          top: centerY - squareSize / 2,
          boxShadow:
            "0 10px 24px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(0,0,0,0.02)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))",
        }}
        aria-hidden
      />

      {/* --- Perfume Lid (Warm Sand via bg-primary / border-primary) --- */}
      {/* Cap */}
      <div
        className="absolute bg-primary"
        style={{
          left: lid.cap.x,
          top: lid.cap.y,
          width: lid.cap.w,
          height: lid.cap.h,
          borderRadius: lid.cap.r,
          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
        }}
        aria-hidden
      />
      {/* Body */}
      <div
        className="absolute bg-primary border border-primary/60"
        style={{
          left: lid.body.x,
          top: lid.body.y,
          width: lid.body.w,
          height: lid.body.h,
          borderRadius: lid.body.r,
          boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
        }}
        aria-hidden
      />
      {/* Base curve */}
      <div
        className="absolute bg-primary"
        style={{
          left: lid.base.x,
          top: lid.base.y,
          width: lid.base.w,
          height: lid.base.h,
          borderRadius: lid.base.r,
          filter: "blur(0.2px)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        }}
        aria-hidden
      />
      {/* Subtle highlight line */}
      <div
        className="absolute bg-background/40"
        style={{
          left: lid.highlight.x,
          top: lid.highlight.y,
          width: lid.highlight.w,
          height: lid.highlight.h,
        }}
        aria-hidden
      />

      {/* --- Animated text around the square (Soft Citrus Yellow via text-accent) --- */}
      {characters.map((char, index) => (
        <AnimatedCharacter
          key={`${char}-${index}`}
          char={char}
          index={index}
          getPosition={getCharacterPosition}
          scale={scale}
        />
      ))}

      {/* --- Brand Title (Warm Sand via text-primary) --- */}
      <div
        className="pointer-events-none absolute w-full text-center"
        style={{ top: centerY + squareSize / 2 + 72 * scale }}
      >
        <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-primary">
          Al‑Mustapha Scents
        </h1>
        <p className="mt-2 text-sm md:text-base text-foreground/70">
          Eau de Parfum • Hand‑crafted luxury
        </p>
      </div>
    </div>
  );
}

function AnimatedCharacter({
  char,
  index,
  getPosition,
  scale,
}: {
  char: string;
  index: number;
  getPosition: (index: number, offset: number) => {
    x: number;
    y: number;
    rotation: number;
  };
  scale: number;
}) {
  // Sample many points to generate smooth keyframes
  const numKeyframes = 120;
  const squareSize = 340 * scale;
  const perimeter = squareSize * 4;

  const keyframes = useMemo(() => {
    return Array.from({ length: numKeyframes + 1 }, (_, i) => {
      const offset = (i / numKeyframes) * perimeter;
      return getPosition(index, offset);
    });
  }, [index, perimeter, getPosition]);

  const xs = keyframes.map((k) => k.x);
  const ys = keyframes.map((k) => k.y);
  const rs = keyframes.map((k) => k.rotation);

  return (
    <motion.span
      className="absolute select-none font-medium text-base md:text-lg text-accent drop-shadow-[0_1px_0_rgba(0,0,0,0.05)]"
      initial={{ x: xs[0], y: ys[0], rotate: rs[0] }}
      animate={{ x: xs, y: ys, rotate: rs }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      style={{
        // Nudge to visually center each glyph on the path
        transformOrigin: "center",
        // Tiny letter spacing helps readability around corners
        letterSpacing: "0.02em",
      }}
    >
      {char}
    </motion.span>
  );
}
