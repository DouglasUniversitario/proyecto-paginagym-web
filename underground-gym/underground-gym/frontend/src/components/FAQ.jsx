import React from "react";
import "./styles/FAQ.css";

export default function FAQ({ setCurrent }) {
  const faqs = [
    {
      pregunta: "¿Cuál es el horario del gimnasio?",
      respuesta:
        "Lunes - sábado abrimos de 5:00 AM a 10:00 PM. Sábados de 6:00 AM a 4:00 PM.",
    },
    {
      pregunta: "¿Hay entrenadores personales?",
      respuesta: "Sí, contamos con entrenadores certificados.",
    },
    {
      pregunta: "¿Cómo puedo pagar mi plan?",
      respuesta:
        "Aceptamos pagos en efectivo, tarjeta y transferencias bancarias.",
    },
    {
      pregunta: "¿Ofrecen asesoría nutricional?",
      respuesta:
        "Sí, tenemos planes personalizados con nutricionistas aliados.",
    },
    {
      pregunta: "¿Cuentan con duchas y vestidores?",
      respuesta:
        "Sí, contamos con duchas y lockers para tu comodidad.",
    },
    {
      pregunta: "¿Aceptan pagos en línea?",
      respuesta:
        "Correcto, puedes pagar desde nuestra página web o directamente en recepción.",
    },
  ];

  const irAContacto = () => {
    if (setCurrent) {
      setCurrent("contacto");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="faq-page">
      <div className="faq-hero">
        <div className="faq-hero-inner">
          <span className="faq-badge">Centro de ayuda</span>
          <h1>Preguntas Frecuentes</h1>
          <p>
            Resolvemos las dudas más comunes sobre planes, pagos y servicios de
            Underground Gym. Si necesitas algo más, puedes escribirnos desde la
            sección de <strong>Contacto</strong>.
          </p>
        </div>
      </div>

      <div className="faq-content">
        <div className="faq-main">
          {faqs.map((item, i) => (
            <article key={i} className="faq-item">
              <h3>{item.pregunta}</h3>
              <p>{item.respuesta}</p>
            </article>
          ))}
        </div>

        <aside className="faq-aside">
          <div className="faq-aside-card">
            <h3>¿No encuentras tu duda?</h3>
            <p>
              Puedes enviarnos un mensaje desde el formulario de contacto y con
              gusto te respondemos lo antes posible.
            </p>
            <button onClick={irAContacto}>Ir a Contacto</button>
          </div>

          <div className="faq-aside-mini">
            <p className="faq-aside-label">Tips rápidos</p>
            <ul>
              <li>Trae una toalla y tu propia botella reutilizable.</li>
              <li>Llega 10 minutos antes de tu rutina.</li>
              <li>Pregunta por tu entrenador en recepción.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
