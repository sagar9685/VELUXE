/**
 * Builds a sized image URL from an Unsplash photo id.
 * Sample imagery is referenced from Unsplash. Every image is rendered through
 * ImageWithFallback, so a missing photo degrades to a branded placeholder.
 * Replace these with licensed brand photography before going live.
 */
export const photo = (id, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const HERO_IMAGE = photo('photo-1492144534655-ae79c964c9d7', 2400);
