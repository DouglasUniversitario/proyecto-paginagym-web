//Codigo que muestra ventana de preguntas frecuetes
import React from "react";

// Define el componente funcional FAQ
const FAQ = () => {

    // Array de objetos que contiene las preguntas y respuestas
  const preguntas = [
    { pregunta: "¿Cuál es el horario del gimnasio?", respuesta: "Lunes - sabado abrimos de 5:00 AM a 10:00 PM. Sabados de 6:00 AM a 4:00 PM" },
    { pregunta: "¿Hay entrenadores personales?", respuesta: "Sí, contamos con entrenadores certificados." },
    { pregunta: "¿Cómo puedo pagar mi plan?", respuesta: "Aceptamos pagos en efectivo, tarjeta y transferencias." },
    { pregunta: "¿Ofrecen asesoría nutricional?", respuesta: "Sí, tenemos planes personalizados con nutricionistas." },
    { pregunta: "¿Cuentan con duchas y vestirodres?", respuesta: "Sí, contamos con duchas y lockers para tu comodidad." },
    { pregunta: "¿Aceptan pagos en línea?", respuesta: "Correcto, puedes pagar desde nuestra pagina web." }
  ];

// Renderiza la sección de Preguntas Frecuentes
  return (
    <div style={{ padding: "20px" }}>

        {/* Título principal */}
      <h2>Preguntas Frecuentes</h2>
      <h2>---------------------------------------</h2>

      {/* Recorre el array 'preguntas' y muestra cada pregunta con su respuesta */}
      {preguntas.map((item, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
            {/* Pregunta en negrita */}
          <strong>{item.pregunta}</strong>
          {/* Respuesta de la prgunta */}
          <p>{item.respuesta}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;