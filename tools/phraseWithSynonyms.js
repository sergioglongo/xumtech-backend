const phraseWithSynonyms = (userText, synonymsMap) => {
  if (!synonymsMap || typeof synonymsMap !== 'object') {
    return userText;
  }
  
  const replacementMap = {};
  for (const [canonicalWord, synonymsArray] of Object.entries(synonymsMap)) {
    const lowerCanonical = canonicalWord.toLowerCase();
    
    replacementMap[lowerCanonical] = lowerCanonical;

    if (Array.isArray(synonymsArray)) {
      for (const synonym of synonymsArray) {
        if (typeof synonym === 'string') {
          replacementMap[synonym.toLowerCase()] = lowerCanonical;
        }
      }
    }
  }
  const allWordsToReplace = Object.keys(replacementMap).join('|');
  const regex = new RegExp(`\\b(${allWordsToReplace})\\b`, 'gi');

  return userText.replace(regex, (matchedWord) => {
    return replacementMap[matchedWord.toLowerCase()];
  });
}

module.exports = { phraseWithSynonyms };