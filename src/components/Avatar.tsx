import { AVATAR_COLORS } from '../lib/constants';

interface AvatarProps {
  emoji: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-11 h-11 text-xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-24 h-24 text-5xl',
};

export function Avatar({ emoji, color, size = 'md' }: AvatarProps) {
  const palette = AVATAR_COLORS[color] ?? AVATAR_COLORS.rosa;
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full shrink-0 border-4`}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.ring,
        boxShadow: `0 4px 14px -4px ${palette.ring}`,
      }}
    >
      <span style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.08))' }}>{emoji}</span>
    </div>
  );
}
