export const AVATAR_COLORS: Record<string, { bg: string; ring: string; text: string; chart: string }> = {
  rosa: { bg: '#ffd6e3', ring: '#ff8fab', text: '#c23764', chart: '#ff5c8a' },
  ceu: { bg: '#cfe8ff', ring: '#8ecae6', text: '#2a6f97', chart: '#4ea8de' },
  hortela: { bg: '#c8f4e2', ring: '#7fd8b8', text: '#1d7a5f', chart: '#2fae82' },
  amarelo: { bg: '#ffedb0', ring: '#ffd166', text: '#a3720b', chart: '#f2a900' },
  lilas: { bg: '#e3d7ff', ring: '#b498ff', text: '#6a3fc7', chart: '#8f5cf2' },
  pessego: { bg: '#ffdcc2', ring: '#ffab76', text: '#b35a1f', chart: '#ff8c42' },
};

export const AVATAR_COLOR_KEYS = Object.keys(AVATAR_COLORS);

export const AVATAR_EMOJIS = [
  '🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🦄',
  '🐸', '🐷', '🐯', '🐵', '🦁', '🐹', '🐣', '🦋',
  '🌸', '🌟', '🍀', '🍓', '🍉', '💪', '🎀', '🌈',
];

export const STORAGE_KEY = 'peso-medidas:participantes';
