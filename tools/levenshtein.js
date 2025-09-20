'use strict';

function calculateLevenshteinDistance(phrase1 = '', phrase2 = '') {
  const track = Array(phrase2.length + 1).fill(null).map(() =>
    Array(phrase1.length + 1).fill(null));

  for (let i = 0; i <= phrase1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= phrase2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= phrase2.length; j += 1) {
    for (let i = 1; i <= phrase1.length; i += 1) {
      const indicator = phrase1[i - 1] === phrase2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // Costo de eliminación
        track[j - 1][i] + 1, // Costo de inserción
        track[j - 1][i - 1] + indicator, // Costo de sustitución
      );
    }
  }
  
  return track[phrase2.length][phrase1.length];
}

module.exports = {
  calculateLevenshteinDistance,
};