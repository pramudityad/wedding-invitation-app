/**
 * @typedef {Object} Photo
 * @property {number} id - Unique photo identifier
 * @property {string} url - Photo URL
 * @property {Record<string, string>} title - Localized titles (e.g., { en: "...", id: "..." })
 * @property {Record<string, string>} caption - Localized captions
 */

export const getLocalizedText = (texts, language) => {
  return texts[language] || texts['en'] || '';
};
