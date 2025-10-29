import React from "react";

export default function Inicio({ setCurrent }) {
  return (
    <section className="hero">
      <h1>
        Entrena duro. Vive <span>UNDERGROUND</span>.
      </h1>
      <p>
        Rutinas, alimentación y suplementos diseñados para maximizar tu rendimiento físico.
      </p>
      <div className="hero-buttons">
        <button className="btn btn-primary" onClick={() => setCurrent("rutinas")}>
          Empieza ahora
        </button>
        <button className="btn btn-outline" onClick={() => setCurrent("planes")}>
          Ver planes
        </button>
      </div>
    </section>
  );
}
