import React from "react";
import "./styles/Inicio.css";

export default function Inicio({ setCurrent }) {
  const entrenadores = [
    {
      nombre: "Carlos Martínez",
      rol: "Coach de fuerza",
      desc: "Especialista en hipertrofia y powerlifting.",
      foto: "/imagenes/Entrenador1.avif",
    },
    {
      nombre: "Rene Morales",
      rol: "Coach funcional",
      desc: "Entrenamientos funcionales y acondicionamiento físico.",
      foto: "/imagenes/Entrenador3.jpg",
    },
    {
      nombre: "Diego Ramírez",
      rol: "Nutrición y rendimiento",
      desc: "Te ayuda a ajustar tu alimentación a tus objetivos.",
      foto: "/imagenes/Entrenador2.jpg",
    },
  ];

  const irAPlanes = () => setCurrent && setCurrent("planes");
  const irARutinas = () => setCurrent && setCurrent("rutinas");
  const irAContacto = () => setCurrent && setCurrent("contacto");

  return (
    <main className="home-page">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <p className="home-hero-badge">GYM • Rendimiento • Comunidad</p>
          <h1>
            Entrena duro. Vive <span>UNDERGROUND.</span>
          </h1>
          <p className="home-hero-subtitle">
            Rutinas, alimentación y suplementos diseñados para maximizar tu
            rendimiento físico.
          </p>

          <div className="home-hero-actions">
            <button className="btn-primary" onClick={irARutinas}>
              Empieza ahora
            </button>
            <button className="btn-outline" onClick={irAPlanes}>
              Ver planes
            </button>
          </div>
        </div>
      </section>

      {/* SOBRE EL GYM */}
      <section className="home-about">
        <div className="home-section-header">
          <h2>¿Por qué entrenar en UNDERGROUND?</h2>
          <p>
            No es solo un gym, es un espacio pensado para que mejores tu cuerpo
            y tu mente con acompañamiento real.
          </p>
        </div>

        <div className="home-about-grid">
          <article className="home-about-card">
            <h3>Ambiente real de entrenamiento</h3>
            <p>
              Equipo de fuerza, máquinas y zona funcional para que puedas
              trabajar cualquier grupo muscular sin esperar tanto.
            </p>
          </article>

          <article className="home-about-card">
            <h3>Acompañamiento y planes</h3>
            <p>
              Rutinas según tu nivel, asesoría básica de alimentación y
              seguimiento por parte de nuestros coaches.
            </p>
          </article>

          <article className="home-about-card">
            <h3>Suplementos y comunidad</h3>
            <p>
              Acceso a suplementos dentro de la plataforma y una comunidad que
              también está buscando mejorar cada día.
            </p>
          </article>
        </div>
      </section>

      {/* ENTRENADORES */}
      <section className="home-trainers">
        <div className="home-section-header">
          <h2>Nuestros entrenadores</h2>
          <p>
            Profesionales listos para ayudarte a entrenar de forma segura y
            efectiva.
          </p>
        </div>

        <div className="home-trainers-grid">
          {entrenadores.map((coach) => (
            <article key={coach.nombre} className="home-trainer-card">
              <div className="home-trainer-avatar">
                <img src={coach.foto} alt={coach.nombre} />
              </div>
              <h3>{coach.nombre}</h3>
              <p className="home-trainer-role">{coach.rol}</p>
              <p className="home-trainer-desc">{coach.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* UBICACIÓN */}
      <section className="home-location">
        <div className="home-location-content">
          <div className="home-location-text">
            <div className="home-section-header left">
              <h2>¿Dónde estamos?</h2>
              <p>
                Entrena en un lugar accesible y seguro. Encuéntranos y arma tu
                rutina ideal.
              </p>
            </div>

            <ul className="home-location-list">
              <li>
                <strong>Dirección:</strong> UNDERGROUND_gym
              </li>
              <li>
                <strong>Horario:</strong> Lun - Vie 5:00 a.m. - 10:00 p.m. ·
                Sáb 6:00 a.m. - 4:00 p.m.
              </li>
              <li>
                <strong>Contacto:</strong> +503 1234-5678 ·{" "}
                info@undergroundgym.com
              </li>
            </ul>

            <button className="btn-primary ghost" onClick={irAContacto}>
              Contactar al gym
            </button>
          </div>

          <div className="home-location-map">
            <iframe
              title="Ubicación Underground Gym"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.615217995212!2d-89.23844792633524!3d13.681145798928293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6331cd305c735b%3A0x3d2a75b3761d4ded!2sUniversidad%20Centroamericana%20Jos%C3%A9%20Sime%C3%B3n%20Ca%C3%B1as!5e0!3m2!1ses!2ssv!4v1763954472913!5m2!1ses!2ssv"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
