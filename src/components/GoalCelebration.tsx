import { useMemo } from 'react';

const EMOJIS = ['🎉', '✨', '🎊', '💖', '⭐'];

interface Particle {
  left: number;
  delay: number;
  rotate: number;
  emoji: string;
}

export function GoalCelebration() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: Math.round((i / 14) * 100 + (Math.random() * 6 - 3)),
        delay: Math.random() * 0.5,
        rotate: Math.round(Math.random() * 360 - 180),
        emoji: EMOJIS[i % EMOJIS.length],
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden rounded-t-3xl" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 text-lg animate-confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            ['--confetti-rotate' as string]: `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
