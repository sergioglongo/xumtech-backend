'use strict';

/**
 * Calcula la distancia de Levenshtein entre dos cadenas.
 * La distancia de Levenshtein es el número mínimo de ediciones de un solo carácter
 * (inserciones, eliminaciones o sustituciones) necesarias para cambiar una palabra por otra.
 * @param {string} phrase1 La primera cadena. Por defecto es una cadena vacía.
 * @param {string} phrase2 La segunda cadena. Por defecto es una cadena vacía.
 * @returns {number} La distancia de Levenshtein entre las dos cadenas.
 */
function calculateLevenshteinDistance(phrase1 = '', phrase2 = '') {
  // Crear una matriz para almacenar las distancias
  const track = Array(phrase2.length + 1).fill(null).map(() =>
    Array(phrase1.length + 1).fill(null));

  // La distancia de cualquier primera cadena a una segunda cadena vacía es la longitud de la primera
  for (let i = 0; i <= phrase1.length; i += 1) {
    track[0][i] = i;
  }
  // La distancia de cualquier segunda cadena a una primera cadena vacía es la longitud de la segunda
  for (let j = 0; j <= phrase2.length; j += 1) {
    track[j][0] = j;
  }

  // Rellenar el resto de la matriz
  for (let j = 1; j <= phrase2.length; j += 1) {
    for (let i = 1; i <= phrase1.length; i += 1) {
      // Si los caracteres son iguales, el costo de la sustitución es 0, si no, es 1
      const indicator = phrase1[i - 1] === phrase2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // Costo de eliminación
        track[j - 1][i] + 1, // Costo de inserción
        track[j - 1][i - 1] + indicator, // Costo de sustitución
      );
    }
  }
  
  // El valor en la esquina inferior derecha de la matriz es la distancia final
  return track[phrase2.length][phrase1.length];
}

module.exports = {
  calculateLevenshteinDistance,
};