import defaultAvatar from '../assets/Styles/Logo.png';

/**
 * Safely resolves player/team avatar URLs
 * @param {string|object|null} avatar - avatar url string or {url: string}
 * @returns {string} safe image URL with fallback
 */
export const getSafeAvatarUrl = (avatar) => {
  if (!avatar) return defaultAvatar;

  const url = typeof avatar === 'object' ? avatar.url : avatar;

  if (!url) return defaultAvatar;

  // Block broken absolute server paths
  if (url.includes('users/avatar') || 
      url.includes('68.178.171.95') || 
      url.includes('localhost') ||
      url.includes('127.0.0.1')) {
    return defaultAvatar;
  }

  // ✅ Safe Cloudinary/public CDN
  if (url.includes('res.cloudinary.com') || url.startsWith('http') && !url.includes('3000')) {
    return url;
  }

  // Proxy through backend (future)
  return `${url}?proxy=true` || defaultAvatar;
};

// Generic onError handler
export const handleImageError = (e, fallback = defaultAvatar) => {
  e.target.src = fallback;
  e.target.onError = null; // Prevent loop
  e.target.style.display = 'block'; // Ensure visible
};

export default getSafeAvatarUrl;
