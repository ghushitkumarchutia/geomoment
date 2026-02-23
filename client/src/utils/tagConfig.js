const TAG_TYPES = [
  {
    id: 'safe',
    label: 'Safe',
    emoji: '🛡️',
    color: '#22c55e',
    bgColor: '#dcfce7',
    darkColor: '#166534',
    description: 'Feels secure and safe to be here',
  },
  {
    id: 'unsafe',
    label: 'Unsafe',
    emoji: '⚠️',
    color: '#ef4444',
    bgColor: '#fee2e2',
    darkColor: '#991b1b',
    description: 'Feels threatening or dangerous',
  },
  {
    id: 'lively',
    label: 'Lively',
    emoji: '🎉',
    color: '#a855f7',
    bgColor: '#f3e8ff',
    darkColor: '#6b21a8',
    description: 'Energetic, active, buzzing with life',
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '🍃',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    darkColor: '#1e3a8a',
    description: 'Peaceful, quiet, relaxing atmosphere',
  },
  {
    id: 'crowded',
    label: 'Crowded',
    emoji: '👥',
    color: '#f97316',
    bgColor: '#ffedd5',
    darkColor: '#9a3412',
    description: 'Packed with people, hard to move',
  },
  {
    id: 'deserted',
    label: 'Deserted',
    emoji: '🏚️',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    darkColor: '#374151',
    description: 'Empty, abandoned, nobody around',
  },
];

const TAG_MAP = Object.fromEntries(TAG_TYPES.map((t) => [t.id, t]));

export const getTagById = (id) => TAG_MAP[id] || TAG_MAP.deserted;

export const TAG_IDS = TAG_TYPES.map((t) => t.id);

export default TAG_TYPES;
