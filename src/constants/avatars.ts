// Eagerly import all avatar images - they'll be bundled and ready instantly
const avatarModules = import.meta.glob('../assets/Avatars/*.png', { 
  eager: true, 
  query: '?url', 
  import: 'default' 
});

// Convert to sorted array
const sortedAvatars = Object.entries(avatarModules)
  .map(([path, url]) => {
    const fileName = path.split('/').pop() || '';
    const id = parseInt(fileName.split('.')[0]);
    return {
      id,
      path: url as string,
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

