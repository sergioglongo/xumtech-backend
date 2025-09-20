'use strict';

const { normalizeText } = require('./textTools');

function checkKeywords(userText, originalSynonymsMap) {
  const keywords = Object.keys(originalSynonymsMap);
  if (!originalSynonymsMap || keywords.length < 2) {
    return false;
  }

  const normalizedSynonymsMap = {};
  for (const [key, values] of Object.entries(originalSynonymsMap)) {
    const normalizedKey = normalizeText(key);
    normalizedSynonymsMap[normalizedKey] = values.map(v => normalizeText(v));
  }

  const userWords = new Set(userText.split(/\s+/));
  return Object.keys(normalizedSynonymsMap).every(normalizedCanonicalWord => {
    const normalizedSynonyms = normalizedSynonymsMap[normalizedCanonicalWord] || [];
    const wordsToSearch = [normalizedCanonicalWord, ...normalizedSynonyms];
    
    return wordsToSearch.some(word => userWords.has(word));
  });
}

module.exports = { checkKeywords };