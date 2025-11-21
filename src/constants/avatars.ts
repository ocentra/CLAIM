// Eagerly import all avatar images - they'll be bundled and ready instantly
// Using Vite's import.meta.glob to load all avatar images
const avatarModules = import.meta.glob('../assets/Avatars/*.png', { eager: true });

// Convert to sorted array
const sortedAvatars = Object.entries(avatarModules)
  .map(([path, module]) => {
    const fileName = path.split('/').pop() || '';
    const id = parseInt(fileName.split('.')[0]);
    // Vite returns the default export which is the URL string
    const avatarUrl = (module as { default: string }).default;
    return {
      id,
      path: avatarUrl,
      name: `Avatar ${id}`
    };
  })
  .sort((a, b) => a.id - b.id);

// Shared avatar configuration - loaded once and reused
export const AVATARS = sortedAvatars;

export const getAvatarPath = (id: number): string => {
  const avatar = AVATARS.find(a => a.id === id);
  return avatar?.path || AVATARS[0]?.path || '';
};

export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex].path;
};

