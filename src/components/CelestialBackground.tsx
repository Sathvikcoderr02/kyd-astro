'use client';

import { useEffect, useState, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
  color: string;
}

interface Planet {
  id: string;
  name: string;
  size: number;
  orbitRadius: number;
  orbitDuration: number;
  color: string;
  glowColor: string;
  startAngle: number;
}

const PLANET_DATA: Planet[] = [
  { id: 'mercury', name: 'Budh', size: 14, orbitRadius: 140, orbitDuration: 12, color: '#B5B5B5', glowColor: 'rgba(181,181,181,0.6)', startAngle: 0 },
  { id: 'venus', name: 'Shukra', size: 20, orbitRadius: 200, orbitDuration: 18, color: '#FFD700', glowColor: 'rgba(255,215,0,0.6)', startAngle: 72 },
  { id: 'mars', name: 'Mangal', size: 18, orbitRadius: 270, orbitDuration: 25, color: '#FF4500', glowColor: 'rgba(255,69,0,0.6)', startAngle: 144 },
  { id: 'jupiter', name: 'Guru', size: 36, orbitRadius: 360, orbitDuration: 40, color: '#FFA500', glowColor: 'rgba(255,165,0,0.6)', startAngle: 216 },
  { id: 'saturn', name: 'Shani', size: 32, orbitRadius: 450, orbitDuration: 55, color: '#DAA520', glowColor: 'rgba(218,165,32,0.6)', startAngle: 288 },
];

const STAR_COLORS = [
  '#ffffff',
  '#ffe4c4',
  '#add8e6',
  '#ffd700',
  '#e6e6fa',
];

export default function CelestialBackground() {
  const [mounted, setMounted] = useState(false);

  // Generate stars only on client side
  const stars = useMemo(() => {
    if (!mounted) return [];
    return [...Array(120)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3,
      opacity: 0.3 + Math.random() * 0.7,
      twinkleDelay: Math.random() * 5,
      twinkleDuration: 2 + Math.random() * 3,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0820] via-[#150d2a] to-[#0a0618]" />

      {/* Nebula effects */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />

      {/* Stars layer */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${star.twinkleDuration}s`,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            }}
          />
        ))}
      </div>

      {/* Central Sun */}
      <div className="sun-container">
        <div className="sun">
          <div className="sun-core" />
          <div className="sun-glow" />
          <div className="sun-corona" />
          <div className="sun-rays" />
        </div>
      </div>

      {/* Orbital paths */}
      {PLANET_DATA.map((planet) => (
        <div
          key={`orbit-${planet.id}`}
          className="orbit-path"
          style={{
            width: `${planet.orbitRadius * 2}px`,
            height: `${planet.orbitRadius * 2}px`,
          }}
        />
      ))}

      {/* Planets */}
      {PLANET_DATA.map((planet) => (
        <div
          key={planet.id}
          className="planet-orbit"
          style={{
            width: `${planet.orbitRadius * 2}px`,
            height: `${planet.orbitRadius * 2}px`,
            animationDuration: `${planet.orbitDuration}s`,
            animationDelay: `${-(planet.startAngle / 360) * planet.orbitDuration}s`,
          }}
        >
          <div
            className="planet"
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`,
              backgroundColor: planet.color,
              boxShadow: `0 0 ${planet.size}px ${planet.glowColor}, 0 0 ${planet.size * 2}px ${planet.glowColor}, inset 0 0 ${planet.size / 3}px rgba(255,255,255,0.3)`,
              animationDuration: `${planet.orbitDuration}s`,
            }}
            title={planet.name}
          >
            {/* Saturn's rings */}
            {planet.id === 'saturn' && (
              <div className="saturn-rings" />
            )}
          </div>
        </div>
      ))}

      {/* Moon */}
      <div className="moon-container">
        <div className="moon">
          <div className="moon-glow" />
          <div className="moon-surface">
            <div className="moon-crater moon-crater-1" />
            <div className="moon-crater moon-crater-2" />
            <div className="moon-crater moon-crater-3" />
            <div className="moon-crater moon-crater-4" />
            <div className="moon-crater moon-crater-5" />
          </div>
          <div className="moon-shadow" />
        </div>
      </div>

      {/* Zodiac constellation hint - Aries */}
      <svg className="constellation constellation-1" viewBox="0 0 100 100">
        <circle cx="20" cy="30" r="2" fill="#fff" opacity="0.6" />
        <circle cx="35" cy="25" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="50" cy="35" r="2" fill="#fff" opacity="0.7" />
        <circle cx="65" cy="30" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="80" cy="40" r="2" fill="#fff" opacity="0.6" />
        <line x1="20" y1="30" x2="35" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="35" y1="25" x2="50" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="50" y1="35" x2="65" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="65" y1="30" x2="80" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </svg>

      {/* Zodiac constellation hint - Scorpio */}
      <svg className="constellation constellation-2" viewBox="0 0 100 100">
        <circle cx="10" cy="50" r="2" fill="#fff" opacity="0.6" />
        <circle cx="25" cy="45" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="40" cy="50" r="2" fill="#fff" opacity="0.7" />
        <circle cx="55" cy="55" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="70" cy="50" r="2" fill="#fff" opacity="0.6" />
        <circle cx="85" cy="45" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="90" cy="35" r="2" fill="#fff" opacity="0.6" />
        <line x1="10" y1="50" x2="25" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="25" y1="45" x2="40" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="40" y1="50" x2="55" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="55" y1="55" x2="70" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="70" y1="50" x2="85" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="85" y1="45" x2="90" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </svg>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
