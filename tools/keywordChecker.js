'use strict';

const { normalizeText } = require('./textTools');
/**
 * Verifica si un texto de usuario contiene todas las palabras clave o sus sinónimos.
 * Por cada palabra clave, comprueba si la palabra clave en sí O uno de sus sinónimos
 * está presente en el texto del usuario. Para evitar falsos positivos, esta función
 * solo se ejecuta si hay 2 o más palabras clave definidas.
 *
 * @param {string} userText - El texto del usuario, normalizado a minúsculas.
 * @param {Object} originalSynonymsMap - El mapa de sinónimos original de la BD. Ej: { "plazo": ["tiempo"], "entregar": ["enviar"] }
 * @returns {boolean} - `true` si todas las palabras clave se encuentran en el texto, `false` en caso contrario.
 */
function checkKeywords(userText, originalSynonymsMap) {
  // Para evitar falsos positivos, solo evaluamos si hay al menos 2 palabras clave.
  // Una pregunta con una sola palabra clave (ej: "pagos") es demasiado genérica.
  const keywords = Object.keys(originalSynonymsMap);
  if (!originalSynonymsMap || keywords.length < 2) {
    return false;
  }

  // 1. Normalizar el mapa de sinónimos completo para asegurar comparaciones consistentes.
  const normalizedSynonymsMap = {};
  for (const [key, values] of Object.entries(originalSynonymsMap)) {
    const normalizedKey = normalizeText(key);
    normalizedSynonymsMap[normalizedKey] = values.map(v => normalizeText(v));
  }

  // Creamos un conjunto de palabras del texto del usuario para una búsqueda eficiente.
  // El userText ya viene normalizado desde el controlador.
  const userWords = new Set(userText.split(/\s+/));

  // Usamos `every` para asegurarnos de que CADA palabra clave canónica (o un sinónimo) esté presente.
  return Object.keys(normalizedSynonymsMap).every(normalizedCanonicalWord => {
    // La clave ya está normalizada. Ahora obtenemos sus sinónimos (también ya normalizados).
    const normalizedSynonyms = normalizedSynonymsMap[normalizedCanonicalWord] || [];
    const wordsToSearch = [normalizedCanonicalWord, ...normalizedSynonyms];
    
    // Usamos `some` para ver si AL MENOS UNA de estas palabras está en el texto del usuario.
    return wordsToSearch.some(word => userWords.has(word));
  });
}

module.exports = { checkKeywords };