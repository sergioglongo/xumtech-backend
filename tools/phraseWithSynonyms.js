/**
 * Expande el texto del usuario reemplazando sinónimos por sus palabras canónicas.
 * 
 * @param {string} userText - La pregunta o frase escrita por el usuario.
 * @param {Object} synonymsMap - Mapa de sinónimos: { palabraCanónica: [sinónimo1, sinónimo2, ...] }
 * @returns {string} - El texto expandido/normalizado.
 */
function phraseWithSynonyms(userText, synonymsMap) {
  // Si no hay mapa de sinónimos, devolvemos el texto original
  if (!synonymsMap || typeof synonymsMap !== 'object') {
    return userText;
  }
  
  // Paso 1: Crear un mapa de reemplazo para búsqueda rápida: palabra_a_buscar -> palabra_canónica
  // Este mapa incluirá tanto los sinónimos como las propias palabras canónicas.
  const replacementMap = {};
  for (const [canonicalWord, synonymsArray] of Object.entries(synonymsMap)) {
    const lowerCanonical = canonicalWord.toLowerCase();
    
    // La palabra canónica también apunta a sí misma para normalizarla (ej. mayúsculas/minúsculas)
    replacementMap[lowerCanonical] = lowerCanonical;

    if (Array.isArray(synonymsArray)) {
      for (const synonym of synonymsArray) {
        if (typeof synonym === 'string') {
          replacementMap[synonym.toLowerCase()] = lowerCanonical;
        }
      }
    }
  }

  // Paso 2: Reemplazar todas las ocurrencias usando una expresión regular.
  // Esto es más eficiente que dividir en palabras y procesar una por una.
  // \b asegura que solo reemplacemos palabras completas.
  const allWordsToReplace = Object.keys(replacementMap).join('|');
  const regex = new RegExp(`\\b(${allWordsToReplace})\\b`, 'gi');

  return userText.replace(regex, (matchedWord) => {
    return replacementMap[matchedWord.toLowerCase()];
  });
}

module.exports = { phraseWithSynonyms };