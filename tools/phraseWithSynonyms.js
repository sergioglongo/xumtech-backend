// tools/synonymExpander.js

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

  // Paso 1: Crear un mapa INVERSO para búsqueda rápida: sinónimo -> palabra canónica
  const reverseSynonymMap = {};
  for (const [canonicalWord, synonymsArray] of Object.entries(synonymsMap)) {
    if (Array.isArray(synonymsArray)) {
      for (const synonym of synonymsArray) {
        if (typeof synonym === 'string') {
          reverseSynonymMap[synonym.toLowerCase()] = canonicalWord.toLowerCase();
        }
      }
    }
  }

  // Paso 2: Dividir el texto del usuario en palabras
  const words = userText.split(/\s+/); // Divide por espacios

  // Paso 3: Procesar cada palabra
  const expandedWords = words.map(word => {
    // Limpiar la palabra: quitar signos de puntuación al inicio y final
    const cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, '');

    // Buscar si la palabra "limpia" está en el mapa inverso de sinónimos
    const canonicalReplacement = reverseSynonymMap[cleanWord.toLowerCase()];

    if (canonicalReplacement) {
      // Si encontramos un reemplazo, lo aplicamos
      // Mantenemos la puntuación original alrededor de la palabra
      const prefix = word.match(/^[^\w]*/)[0] || ''; // Puntuación al inicio
      const suffix = word.match(/[^\w]*$/)[0] || ''; // Puntuación al final
      return prefix + canonicalReplacement + suffix;
    }

    // Si no hay reemplazo, devolvemos la palabra original
    return word;
  });

  // Paso 4: Reconstruir y devolver el texto
  return expandedWords.join(' ');
}

module.exports = { phraseWithSynonyms };