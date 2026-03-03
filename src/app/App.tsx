import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
// Import the logo image for AL-MUSTAPHA brand
import logo from 'figma:asset/bd9a24452aace1a1c7fa38d78abe56bf8ce3f510.png';

export default function App() {
  // Text that animates around the square bottle outline - Change this to update rotating text
  const text = "Fresh Cotton  •  Lavender  •  Warm Musk  •  ";
  const [characters, setCharacters] = useState<string[]>([]);

  useEffect(() => {
    // Split text into individual characters for animation
    setCharacters(text.split(''));
  }, []);

  // ===== RESPONSIVE VIEWPORT CALCULATIONS =====
  // These ensure the design scales properly on all screen sizes
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1080;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1920;
  
  // Scale factor based on viewport width (1080px as base for Instagram Reel)
  const scale = vw / 1080;
  
  // ===== SQUARE BOTTLE OUTLINE DIMENSIONS =====
  // Change squareSize to make the invisible bottle outline bigger/smaller
  const squareSize = 340 * scale;
  // Center position of the square (horizontal center)
  const centerX = vw / 2;
  // Center position of the square (vertical - 0.458 = ~880/1920 ratio)
  // Adjust this ratio to move the entire square up/down
  const centerY = vh * 0.458;
  
  // Calculate perimeter length for text animation path
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
    
    // ===== TEXT ANIMATION PATH (COUNTERCLOCKWISE) =====
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
    // ===== MAIN BACKGROUND COLOR =====
    // Change bg-[#561C24] to update the deep burgundy background color
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#561C24] flex items-center justify-center">
      {/* Instagram Reel container - 1080x1920 responsive */}
      <div 
        className="relative bg-[#561C24] w-full h-full"
      >
        {/* ===== PERFUME LID (TOP OF BOTTLE) ===== */}
        {/* Static decorative element positioned above the square */}
        {/* Adjust vh * 0.302 to move lid up/down - 12 * scale moves it horizontally */}
        <div 
          className="absolute"
          style={{ 
            left: `${centerX + (12 * scale)}px`, // Horizontal alignment (12px offset to center with logo)
            top: `${vh * 0.302}px`, // Vertical position (~580/1920 ratio) - CHANGE THIS to move lid up/down
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          {/* SVG drawing of the perfume lid - Change fill colors to update lid color */}
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            {/* Lid top - Change fill="#C7B7A3" to change lid color */}
            <ellipse cx="60" cy="15" rx="45" ry="15" fill="#C7B7A3" opacity="0.95"/>
            {/* Lid body */}
            <rect x="20" y="15" width="80" height="50" fill="#C7B7A3" opacity="0.9"/>
            {/* Lid bottom curve */}
            <path d="M 20 65 Q 60 75 100 65 L 100 15 L 20 15 Z" fill="#C7B7A3" opacity="0.85"/>
            {/* Subtle highlight on top */}
            <ellipse cx="60" cy="15" rx="35" ry="10" fill="#D8C8B3" opacity="0.4"/>
            {/* Decorative detail (small rectangle in center) */}
            <rect x="55" y="40" width="10" height="20" fill="#B8A793" opacity="0.6" rx="2"/>
          </svg>
        </div>

        {/* ===== BRAND LOGO (CENTER OF BOTTLE) ===== */}
        {/* AL-MUSTAPHA logo positioned in the center of the invisible square */}
        <div 
          className="absolute"
          style={{ 
            left: `${centerX + (12 * scale)}px`, // Horizontal centering (12px offset)
            top: `${centerY + (25 * scale)}px`, // Vertical centering (25px down from center) - CHANGE 25 to move logo up/down
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <img 
            src={logo} 
            alt="Al-Mustapha Logo" 
            style={{
              width: `${280}px`, // CHANGE THIS number to make logo bigger/smaller
              height: 'auto',
              opacity: 1, // Change to make logo more/less transparent (0-1)
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* ===== ANIMATED TEXT AROUND SQUARE ===== */}
        {/* Each character animates counterclockwise around the bottle outline */}
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
          className="absolute text-center"
          style={{ 
            left: `${centerX + (12 * scale)}px`, // Horizontal alignment with logo and lid
            top: `${vh * 0.62}px`, // Vertical position (0.62 = 62% down screen) - CHANGE THIS to move title up/down
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          <h1 
            className="text-[#E8D8C4] whitespace-nowrap" // #E8D8C4 = soft beige color - CHANGE THIS for different text color
            style={{
              fontFamily: '"Cormorant Garamond", serif', // Luxury serif font - CHANGE THIS for different font
              fontWeight: 300, // Thin weight - CHANGE to 400, 500, 600, etc. for bolder text
              fontSize: '48px', // CHANGE THIS number to make title bigger/smaller
              letterSpacing: '3px', // CHANGE THIS for tighter/wider letter spacing
              textShadow: '0 3px 12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(232, 216, 196, 0.2)', // Subtle glow effect
            }}
          >
            Arteliye by Al-Mustapha
          </h1>
        </div>
      </div>
    </div>
  );
}

// ===== ANIMATED CHARACTER COMPONENT =====
// This component handles each individual character's animation around the square
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
  const perimeter = 340 * scale * 4; // Total path length (squareSize * 4)
  
  // Generate smooth animation keyframes - samples 100 points along the path for smooth movement
  const numKeyframes = 100;
  const keyframes = Array.from({ length: numKeyframes + 1 }, (_, i) => {
    const offset = (i / numKeyframes) * perimeter;
    return getPosition(index, offset);
  });
  
  return (
    <motion.div
      className="absolute text-[#E8D8C4] select-none pointer-events-none origin-center" // #E8D8C4 = soft beige
      style={{
        fontFamily: '"Cormorant Garamond", serif', // Match brand title font
        fontWeight: 400, // CHANGE THIS for bolder/lighter animated text
        fontSize: `${38 * scale}px`, // CHANGE 38 to make animated text bigger/smaller
        letterSpacing: `${1.5 * scale}px`, // CHANGE 1.5 for tighter/wider spacing
        // Multiple text shadows for depth and readability
        textShadow: `
          0 ${2 * scale}px ${4 * scale}px rgba(0, 0, 0, 0.8),
          0 ${4 * scale}px ${8 * scale}px rgba(0, 0, 0, 0.6),
          0 0 ${30 * scale}px rgba(232, 216, 196, 0.4),
          0 ${1 * scale}px ${2 * scale}px rgba(0, 0, 0, 0.9)
        `,
        filter: `drop-shadow(0 0 ${12 * scale}px rgba(232, 216, 196, 0.25)) contrast(1.1)`,
        WebkitFontSmoothing: 'antialiased',
      }}
      // Animation configuration
      animate={{
        x: keyframes.map(k => k.x).reverse(), // .reverse() makes it go counterclockwise
        y: keyframes.map(k => k.y).reverse(),
        rotate: keyframes.map(k => k.rotation).reverse(),
      }}
      transition={{
        duration: 14, // CHANGE THIS number for faster/slower animation (in seconds)
        repeat: Infinity, // Loop forever
        ease: "linear", // Constant speed (no easing)
        repeatType: "loop"
      }}
    >
      {char}
    </motion.div>
  );
}
