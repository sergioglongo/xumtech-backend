    export const normalizeText = (text) => {
      if (!text) return '';
      return text.toLowerCase()
                 .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                 .replace(/[^\w\s]/gi, '') // Quitar puntuación
                 .trim();
    };