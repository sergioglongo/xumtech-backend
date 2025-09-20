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

  let matchesCount = 0;
  for (const normalizedCanonicalWord of Object.keys(normalizedSynonymsMap)) {
    const normalizedSynonyms = normalizedSynonymsMap[normalizedCanonicalWord] || [];
    const wordsToSearch = [normalizedCanonicalWord, ...normalizedSynonyms];

    if (wordsToSearch.some(word => userText.includes(word))) {
      matchesCount++;
    }
  }

  return matchesCount >= 2;
}

module.exports = { checkKeywords };