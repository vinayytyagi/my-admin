/**
 * SEO-Optimized Slug Generator
 * 
 * Best practices for SEO-friendly URLs:
 * 1. Lowercase only
 * 2. Use hyphens (not underscores) as word separators
 * 3. Remove special characters except hyphens
 * 4. No consecutive hyphens
 * 5. No leading or trailing hyphens
 * 6. Keep it short (50-60 chars max for SEO)
 * 7. Cut at word boundaries, not mid-word
 */

/**
 * Generate an SEO-friendly slug from a title
 * @param {string} title - The title to convert to a slug
 * @param {number} maxLength - Maximum length of the slug (default: 60)
 * @returns {string} - SEO-optimized slug
 */
export function generateSlug(title, maxLength = 60) {
  if (!title || typeof title !== 'string') {
    return '';
  }

  let slug = title
    // Convert to lowercase
    .toLowerCase()
    // Normalize unicode characters (é -> e, etc.)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special characters and punctuation with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    .trim();

  // If slug is too long, cut at word boundary (hyphen)
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    
    // Find the last hyphen and cut there to avoid mid-word cuts
    const lastHyphenIndex = slug.lastIndexOf('-');
    if (lastHyphenIndex > maxLength * 0.6) {
      // Only cut at hyphen if it's not too close to the start
      slug = slug.substring(0, lastHyphenIndex);
    }
  }

  // Final cleanup - remove any trailing hyphens after truncation
  slug = slug.replace(/-+$/g, '');

  return slug;
}

/**
 * Normalize an existing slug (cleanup bad slugs)
 * Use this for slugs already in the database
 * @param {string} slug - The slug to normalize
 * @returns {string} - Cleaned slug
 */
export function normalizeSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return '';
  }

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default generateSlug;