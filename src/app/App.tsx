import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export default function App() {
  const text = "Bergamot  •  Jasmine  •  Musk  •";
  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    // Split text into individual characters
    setCharacters(text.split(''));
  }, []);

  // Use viewport-based dimensions for responsiveness
  // Base calculations on viewport width (vw)
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1080;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1920;
  
  // Scale factor based on viewport width (1080px as base)
  const scale = vw / 1080;
  
  // Square dimensions scaled for viewport
  const squareSize = 340 * scale;
  const centerX = vw / 2;
  const centerY = vh * 0.458; // ~880/1920 ratio
  
  // Calculate perimeter length
  const perimeter = squareSize * 4;
  
  // Calculate positions for each character around the square
  const getCharacterPosition = (index: number, offset: number) => {
    const totalChars = characters.length;
    const spacing = perimeter / totalChars;
    const position = (index * spacing + offset) % perimeter;
    
    let x = 0;
    let y = 0;
    let rotation = 0;
    
    const halfSize = squareSize / 2;
    
    // Top side (moving right)
    if (position < squareSize) {
      x = centerX - halfSize + position;
      y = centerY - halfSize;
      rotation = 0;
    }
    // Right side (moving down)
    else if (position < squareSize * 2) {
      x = centerX + halfSize;
      y = centerY - halfSize + (position - squareSize);
      rotation = 90;
    }
    // Bottom side (moving left)
    else if (position < squareSize * 3) {
      x = centerX + halfSize - (position - squareSize * 2);
      y = centerY + halfSize;
      rotation = 180;
    }
    // Left side (moving up)
    else {
      x = centerX - halfSize;
      y = centerY + halfSize - (position - squareSize * 3);
      rotation = 270;
    }
    
    return { x, y, rotation };
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#561C24] flex items-center justify-center">
      {/* Instagram Reel container - responsive */}
      <div 
        className="relative bg-[#561C24] w-full h-full"
      >
        {/* Perfume Lid - Static */}
        <div 
          className="absolute left-1/2"
          style={{ 
            top: `${vh * 0.302}px`, // ~580/1920 ratio
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            {/* Lid top */}
            <ellipse cx="60" cy="15" rx="45" ry="15" fill="#C7B7A3" opacity="0.95"/>
            {/* Lid body */}
            <rect x="20" y="15" width="80" height="50" fill="#C7B7A3" opacity="0.9"/>
            {/* Lid bottom curve */}
            <path d="M 20 65 Q 60 75 100 65 L 100 15 L 20 15 Z" fill="#C7B7A3" opacity="0.85"/>
            {/* Subtle highlight */}
            <ellipse cx="60" cy="15" rx="35" ry="10" fill="#D8C8B3" opacity="0.4"/>
            {/* Decorative detail */}
            <rect x="55" y="40" width="10" height="20" fill="#B8A793" opacity="0.6" rx="2"/>
          </svg>
        </div>

        {/* Animated Text Around Square */}
        <div className="absolute inset-0">
          {characters.map((char, index) => (
            <AnimatedCharacter
              key={index}
              char={char}
              index={index}
              getPosition={getCharacterPosition}
              scale={scale}
            />
          ))}
        </div>

        {/* Brand Title - Static */}
        <div 
          className="absolute left-1/2 text-center"
          style={{ 
            top: `${vh * 0.62}px`, // Below the bottle
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          <h1 
            className="text-[#E8D8C4] whitespace-nowrap"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontSize: '48px',
              letterSpacing: '3px',
              textShadow: '0 3px 12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(232, 216, 196, 0.2)',
            }}
          >
            Al-Mustapha Scents
          </h1>
        </div>
      </div>
    </div>
  );
}

function AnimatedCharacter({ 
  char, 
  index, 
  getPosition,
  scale
}: { 
  char: string; 
  index: number; 
  getPosition: (index: number, offset: number) => { x: number; y: number; rotation: number };
  scale: number;
}) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1080;
  const perimeter = 340 * scale * 4; // squareSize * 4
  
  // Generate smooth keyframes - sample at many points along the path
  const numKeyframes = 100;
  const keyframes = Array.from({ length: numKeyframes + 1 }, (_, i) => {
    const offset = (i / numKeyframes) * perimeter;
    return getPosition(index, offset);
  });
  
  return (
    <motion.div
      className="absolute text-[#E8D8C4] select-none pointer-events-none origin-center"
      style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 400,
        fontSize: `${38 * scale}px`,
        letterSpacing: `${1.5 * scale}px`,
        textShadow: `
          0 ${2 * scale}px ${4 * scale}px rgba(0, 0, 0, 0.8),
          0 ${4 * scale}px ${8 * scale}px rgba(0, 0, 0, 0.6),
          0 0 ${30 * scale}px rgba(232, 216, 196, 0.4),
          0 ${1 * scale}px ${2 * scale}px rgba(0, 0, 0, 0.9)
        `,
        filter: `drop-shadow(0 0 ${12 * scale}px rgba(232, 216, 196, 0.25)) contrast(1.1)`,
        WebkitFontSmoothing: 'antialiased',
      }}
      animate={{
        x: keyframes.map(k => k.x).reverse(),
        y: keyframes.map(k => k.y).reverse(),
        rotate: keyframes.map(k => k.rotation).reverse(),
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop"
      }}
    >
      {char}
    </motion.div>
  );
}
