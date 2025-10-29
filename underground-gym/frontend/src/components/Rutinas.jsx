import React, { useState } from "react";

export default function Rutinas() {
  const [filter, setFilter] = useState("Todos");

  const routinesSeed = [
    {
      id: 1,
      title: "Full Body",
      level: "Principiante",
      focus: "Cuerpo completo",
      img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200",
      desc: "Entrenamiento general 2-3 veces por semana para todo el cuerpo.",
    },
    {
      id: 2,
      title: "Split Clásico",
      level: "Intermedio",
      focus: "Hipertrofia",
      img: "public/Rutinas/Split.jpeg",
      desc: "Rutina dividida por grupos musculares: Pecho-Tríceps, Espalda-Bíceps, Piernas, Hombros.",
    },
    {
      id: 3,
      title: "Push Pull Legs (PPL)",
      level: "Avanzado",
      focus: "Volumen y equilibrio",
      img: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1200",
      desc: "Días divididos en empuje, jalón y piernas. Ideal para progresar rápido.",
    },
  ];

  const filteredRoutines =
    filter === "Todos"
      ? routinesSeed
      : routinesSeed.filter((r) => r.level === filter);

  return (
    <section>
      <h2>Rutinas Disponibles</h2>
      <p>Elige la rutina que se adapte a tus objetivos.</p>

      <div className="filter-container">
        <label>Filtrar por nivel:</label>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div className="grid grid-3">
        {filteredRoutines.map((r) => (
          <div className="card" key={r.id}>
            <img src={r.img} alt={r.title} />
            <div className="card-content">
              <h3>{r.title}</h3>
              <p className="text-small">{r.focus}</p>
              <p>{r.desc}</p>
              <p>
                <strong>Nivel:</strong> {r.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
