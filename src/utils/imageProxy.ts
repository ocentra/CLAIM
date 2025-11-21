/**
 * Image proxy utility - converts external image URLs (Google, Facebook) to Cloudflare Worker proxy URLs
 * This solves CORS issues by proxying images through our Cloudflare Worker
 */

/**
 * Check if an image URL should be proxied (external URLs like Google, Facebook)
 */
export function shouldProxyImage(url: string | null | undefined): boolean {
  if (!url) return false;
  
  // Check if it's already a proxy URL or local asset
  if (url.includes('/api/image-proxy') || url.startsWith('/') || url.startsWith('data:')) {
    return false;
  }
  
  // Check if it's an external URL that needs proxying
  const externalDomains = ['googleusercontent.com', 'facebook.com', 'fbcdn.net'];
  try {
    const urlObj = new URL(url);
    return externalDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Convert an external image URL to a Cloudflare Worker proxy URL
 * @param imageUrl The original image URL (e.g., Google profile picture)
 * @param workerUrl The Cloudflare Worker base URL (from VITE_R2_WORKER_URL)
 * @returns The proxied URL or original URL if proxy is not available
 */
export function getProxiedImageUrl(
  imageUrl: string | null | undefined,
  workerUrl?: string
): string {
  if (!imageUrl) return '';
  
  // Don't proxy if already proxied or local
  if (!shouldProxyImage(imageUrl)) {
    return imageUrl;
  }
  
  // Get worker URL from env if not provided
  const proxyBaseUrl = workerUrl || import.meta.env.VITE_R2_WORKER_URL;
  
  if (!proxyBaseUrl) {
    // No worker URL configured - return original (may have CORS issues)
    console.warn('[imageProxy] VITE_R2_WORKER_URL not configured, using original image URL (may have CORS issues)');
    return imageUrl;
  }
  
  // Build proxy URL
  const proxyUrl = new URL('/api/image-proxy', proxyBaseUrl);
  proxyUrl.searchParams.set('url', imageUrl);
  
  return proxyUrl.toString();
}

