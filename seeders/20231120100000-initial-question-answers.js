'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('question_answer_pairs', [
      {
        question_text: "¿Cuál es el tiempo límite para entregar la solución?",
        answer_text: "Tienes 3 días calendario después de recibir el enunciado para preparar y enviar todo el material necesario.",
        synonyms: JSON.stringify({ "tiempo": ["plazo", "límite", "duración", "fecha"], "entregar": ["enviar", "presentar", "finalizar"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué debo enviar al final de la evaluación?",
        answer_text: "Debes enviar un video demo de tu solución y el código fuente al equipo de reclutamiento por correo electrónico.",
        synonyms: JSON.stringify({ "enviar": ["mandar", "entregar", "subir"], "final": ["terminar", "concluir"], "evaluación": ["proceso", "prueba"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Puedo usar cualquier tecnología?",
        answer_text: "Sí, se permite utilizar cualquier tecnología de tu preferencia, así como bibliotecas y componentes de desarrollo de acceso libre y gratuito.",
        synonyms: JSON.stringify({ "usar": ["emplear", "utilizar"], "cualquier": ["alguna"], "tecnología": ["librería", "framework"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Puedo usar chatbots pre-diseñados?",
        answer_text: "No, se prohíbe el uso de cualquier tecnología específicamente diseñada para chatbots, ya que el propósito es evaluar tu capacidad de construcción de software.",
        synonyms: JSON.stringify({ "chatbots": ["bots", "asistentes"], "prediseñados": ["prefabricados", "listos"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué hago si la solución no está completa?",
        answer_text: "Se insta a presentar tu resultado incluso si no está completamente funcional. El objetivo es examinar y discutir tu solución en la entrevista.",
        synonyms: JSON.stringify({ "solución": ["proyecto", "entrega"], "completa": ["funcional", "terminada"], "hago": ["qué debo hacer", "puedo hacer"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué tipo de video debo enviar?",
        answer_text: "El video debe ser un demo de tu solución. Un video privado de YouTube es suficiente.",
        synonyms: JSON.stringify({ "video": ["demo", "presentación", "grabación"], "tipo": ["clase", "categoría"], "enviar": ["mandar", "subir"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Se pueden hacer preguntas sobre el ejercicio?",
        answer_text: "Puedes contactar a tu reclutador(a) si tienes alguna duda que te impida realizar la entrega. No responderán dudas directamente sobre la solución.",
        synonyms: JSON.stringify({ "preguntas": ["dudas", "consultas"], "ejercicio": ["evaluación", "proyecto", "asignación"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué debo presentar en la entrevista?",
        answer_text: "En la entrevista se espera que justifiques tus decisiones de diseño, hables sobre la escalabilidad de tu solución y las áreas de mejora.",
        synonyms: JSON.stringify({ "entrevista": ["reunión", "presentación"], "presentar": ["exponer", "mostrar"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Se requiere alguna instalación de terceros?",
        answer_text: "No se requiere la instalación de ningún componente adicional o de terceros por parte del usuario para que el bot se ejecute en el navegador.",
        synonyms: JSON.stringify({ "instalación": ["descarga", "requiere"], "terceros": ["adicionales", "externos"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Cómo se almacena la información del chatbot?",
        answer_text: "Las consultas que el bot puede responder deben estar almacenadas en un repositorio de almacenamiento, como una base de datos o un archivo.",
        synonyms: JSON.stringify({ "almacena": ["guarda", "persiste", "salva"], "información": ["datos", "consultas", "contenido"], "chatbot": ["bot"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Cuál es el propósito de esta evaluación?",
        answer_text: "El propósito es que los candidatos puedan mostrar sus habilidades y capacidades consultivas a un panel de entrevistas.",
        synonyms: JSON.stringify({ "propósito": ["objetivo", "meta", "finalidad"], "evaluación": ["prueba", "ejercicio"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Debo justificar mis decisiones de diseño?",
        answer_text: "Sí, es importante tener total claridad de las decisiones de diseño tomadas y conocer la función de cada elemento utilizado.",
        synonyms: JSON.stringify({ "justificar": ["explicar", "fundamentar"], "decisiones": ["elecciones", "diseño"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Se pueden sugerir mejoras a la solución?",
        answer_text: "Sí, se te solicitará realizar ajustes o mejoras durante la entrevista. Si deseas incluir funciones no especificadas, son bienvenidas.",
        synonyms: JSON.stringify({ "sugerir": ["proponer", "plantear"], "mejoras": ["ajustes", "cambios", "funcionalidades"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué pasa si no tengo una solución funcional al 100%?",
        answer_text: "Se insta a siempre presentar tu resultado. El objetivo es examinar y discutir tu solución durante la entrevista, no solo ver una solución perfecta.",
        synonyms: JSON.stringify({ "funcional": ["trabajando"], "solución": ["proyecto"], "100%": ["completa", "terminada"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué se evalúa además del conocimiento técnico?",
        answer_text: "Se evalúan otros aspectos como la capacidad resolutiva, tolerancia a la presión, toma de decisiones y el manejo de la ambigüedad.",
        synonyms: JSON.stringify({ "evalúa": ["analiza", "considera"], "conocimiento": ["habilidades"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué tipo de servicio web debo usar?",
        answer_text: "La comunicación con el repositorio de almacenamiento debe realizarse por medio de un servicio web tipo REST.",
        synonyms: JSON.stringify({ "servicio": ["API", "componente"], "web": ["online"], "usar": ["emplear", "utilizar"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿El bot debe funcionar en cualquier navegador?",
        answer_text: "Para la presentación, puedes elegir uno de los navegadores populares (Firefox, Chrome, Edge, Safari) en su última versión.",
        synonyms: JSON.stringify({ "funcionar": ["ejecutar", "correr"], "cualquier": ["todos", "alguno"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Es importante la seguridad de la aplicación?",
        answer_text: "Sí, debes detallar posibles riesgos, capacidades futuras de autenticación y otros casos de uso que pueden comprometer aspectos de seguridad.",
        synonyms: JSON.stringify({ "seguridad": ["protección", "riesgos"], "aplicación": ["solución", "software"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué es un repositorio de almacenamiento?",
        answer_text: "Es donde se guardan las consultas que el bot puede responder, puede ser una base de datos, un archivo o similar.",
        synonyms: JSON.stringify({ "repositorio": ["almacén", "base", "lugar"], "almacenamiento": ["datos", "información"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Debo considerar la escalabilidad de la solución?",
        answer_text: "Sí, se espera que puedas detallar cómo tu solución puede volverse escalable para recibir más funcionalidades y ser utilizada por miles de usuarios.",
        synonyms: JSON.stringify({ "escalabilidad": ["crecimiento", "escalable"], "solución": ["proyecto", "diseño"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Se debe detallar el proceso de entrenamiento del bot?",
        answer_text: "Sí, aunque solo se requieran 10 preguntas para la entrega, se debe detallar en la entrevista el proceso para ingresar nuevas preguntas.",
        synonyms: JSON.stringify({ "entrenamiento": ["aprendizaje", "configuración"], "detallar": ["explicar", "describir"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿El bot debe abrirse automáticamente?",
        answer_text: "La ventana de chat puede abrirse automáticamente al cargar la página o por medio de alguna acción del usuario, como un botón.",
        synonyms: JSON.stringify({ "abrirse": ["mostrarse", "iniciar"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Cómo se activa la ventana de chat?",
        answer_text: "La ventana de chat puede abrirse automáticamente al cargar la página o por medio de alguna acción del usuario.",
        synonyms: JSON.stringify({ "activa": ["abre", "inicia", "ejecuta"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué pasa si no se comprende una consulta?",
        answer_text: "El bot debe indicar al usuario si la consulta que realiza no fue comprendida, o si corresponde a una de las posibles consultas que puede responder.",
        synonyms: JSON.stringify({ "comprende": ["entiende", "procesa"], "consulta": ["pregunta", "duda"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Cuánto tiempo puede tardar el procesamiento de una consulta?",
        answer_text: "El procesamiento de la consulta no debe tardar más de 5 segundos después de haber enviado el mensaje.",
        synonyms: JSON.stringify({ "tardar": ["demorar", "durar"], "procesamiento": ["análisis", "respuesta"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué es la portabilidad en este contexto?",
        answer_text: "Es la capacidad de la solución para ser utilizada en diferentes entornos. Debes razonar sobre ella en la entrevista.",
        synonyms: JSON.stringify({ "portabilidad": ["movilidad", "compatibilidad"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué debo tener en cuenta para la entrevista?",
        answer_text: "Debes detallar sobre las áreas limitadas de tu solución, tu conformidad con la respuesta y cómo conceptos como portabilidad y modularidad se relacionan con tus decisiones de diseño.",
        synonyms: JSON.stringify({ "tener en cuenta": ["considerar", "detallar"], "entrevista": ["reunión", "evaluación"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué es la modularidad de la solución?",
        answer_text: "Es la capacidad de dividir tu solución en módulos o componentes independientes. Debes razonar sobre ella en la entrevista.",
        synonyms: JSON.stringify({ "modularidad": ["módulos", "componentes", "separación"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Qué es la mantenibilidad?",
        answer_text: "Es la facilidad con la que la solución puede ser modificada o reparada. Debes razonar sobre este concepto en la entrevista.",
        synonyms: JSON.stringify({ "mantenibilidad": ["mantenimiento", "fácil", "modificar"] }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question_text: "¿Cómo puedo contactar al equipo de reclutamiento?",
        answer_text: "Puedes contactar a tu reclutador(a) si tienes alguna duda que te impida realizar tu entrega.",
        synonyms: JSON.stringify({ "contactar": ["llamar", "escribir", "comunicarse", "dudas", "preguntas", "reclutamiento"] }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Esto eliminará TODOS los registros de la tabla.
    await queryInterface.bulkDelete('question_answer_pairs', null, {});
  }
};