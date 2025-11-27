import React, { useState } from "react";
import "./styles/Rutinas.css";

export default function Rutinas({ userPlan }) {
  const rutinasData = [
    {
      id: "full-body-beginner",
      nombre: "Full Body",
      nivel: "Principiante",
      objetivo: "Cuerpo completo",
      descripcionCorta:
        "Ideal para empezar a crear el hábito y aprender técnica.",
      frecuencia: "2-3 veces por semana",
      duracion: "45-60 min",
      imagen: "/imagenes/Full_Body.jpg",
      enfoque: ["Fuerza básica", "Movilidad", "Resistencia"],
      descripcionLarga:
        "Esta rutina Full Body está pensada para que aprendas la técnica de los ejercicios básicos y construyas el hábito de entrenar. Trabaja todo el cuerpo en cada sesión con un volumen moderado.",
      ejercicios: [
        {
          nombre: "Sentadilla libre",
          series: "3",
          repeticiones: "10-12",
          descanso: "60-90 s",
        },
        {
          nombre: "Press de banca con mancuernas",
          series: "3",
          repeticiones: "10-12",
          descanso: "60-90 s",
        },
        {
          nombre: "Remo con mancuerna",
          series: "3",
          repeticiones: "10-12",
          descanso: "60-90 s",
        },
        {
          nombre: "Plancha",
          series: "3",
          repeticiones: "20-30 s",
          descanso: "45-60 s",
        },
      ],
      tips: [
        "Empieza siempre con 5-10 minutos de calentamiento general.",
        "Usa un peso que te permita mantener la técnica perfecta.",
        "Registra tu progreso semana a semana.",
      ],
    },
    {
      id: "split-clasico",
      nombre: "Split Clásico",
      nivel: "Intermedio",
      objetivo: "Hipertrofia",
      descripcionCorta:
        "Rutina dividida por grupos musculares para ganar masa.",
      frecuencia: "4-5 veces por semana",
      duracion: "60-75 min",
      imagen: "/imagenes/Split_Clasico.webp",
      enfoque: ["Pecho / Espalda", "Pierna", "Brazos"],
      descripcionLarga:
        "El split clásico divide los días por grupos musculares (pecho, espalda, pierna, brazos) para maximizar el volumen de trabajo por grupo. Ideal si ya tienes experiencia en el gimnasio.",
      ejercicios: [
        {
          nombre: "Día Pecho: Press banca, Press inclinado, Aperturas",
          series: "4",
          repeticiones: "8-12",
          descanso: "60-90 s",
        },
        {
          nombre: "Día Espalda: Dominadas / Jalón, Remo barra, Remo mancuerna",
          series: "4",
          repeticiones: "8-12",
          descanso: "60-90 s",
        },
      ],
      tips: [
        "Cuida la técnica en cada repetición, no sacrifiques forma por peso.",
        "Descansa bien entre sesiones del mismo grupo muscular.",
      ],
    },
    {
      id: "ppl",
      nombre: "Push Pull Legs (PPL)",
      nivel: "Avanzado",
      objetivo: "Fuerza e hipertrofia",
      descripcionCorta:
        "Volumen alto con días de empuje, jalón y piernas.",
      frecuencia: "5-6 veces por semana",
      duracion: "60-80 min",
      imagen: "/imagenes/Push_Pull_Legs.webp",
      enfoque: ["Empuje", "Jalón", "Piernas"],
      descripcionLarga:
        "PPL es una división avanzada que reparte el entrenamiento en empuje, jalón y piernas, permitiendo alta frecuencia por grupo muscular.",
      ejercicios: [
        {
          nombre: "Día Push: Press banca, Press militar, Fondos",
          series: "4",
          repeticiones: "6-10",
          descanso: "90-120 s",
        },
        {
          nombre: "Día Pull: Dominadas, Remo barra, Face pulls",
          series: "4",
          repeticiones: "6-12",
          descanso: "90-120 s",
        },
      ],
      tips: [
        "Recomendado solo si ya manejas bien la técnica y recuperación.",
        "Controla el volumen para no sobreentrenar.",
      ],
    },
    {
      id: "torso-pierna",
      nombre: "Torso / Pierna",
      nivel: "Intermedio",
      objetivo: "Fuerza y estética",
      descripcionCorta:
        "Excelente equilibrio entre frecuencia, fuerza y volumen de trabajo.",
      frecuencia: "4 días por semana",
      duracion: "60-70 min",
      imagen: "/imagenes/Torso_Pierna.avif",
      enfoque: ["Torso", "Pierna", "Core"],
      descripcionLarga:
        "Torso/Pierna reparte el entrenamiento en dos tipos de sesiones: una enfocada al tren superior y otra al tren inferior. Es una de las divisiones más equilibradas.",
      ejercicios: [
        {
          nombre: "Día Torso: Press banca, Remo barra, Press militar",
          series: "3-4",
          repeticiones: "8-12",
          descanso: "60-90 s",
        },
        {
          nombre: "Día Pierna: Sentadilla, Peso muerto rumano, Zancadas",
          series: "3-4",
          repeticiones: "8-12",
          descanso: "60-90 s",
        },
      ],
      tips: [
        "Deja al menos 1 día de descanso cada 3-4 días de entrenamiento.",
        "Prioriza los ejercicios compuestos al inicio de la sesión.",
      ],
    },
    {
      id: "hiit",
      nombre: "HIIT Quema Grasa",
      nivel: "Intermedio",
      objetivo: "Pérdida de grasa",
      descripcionCorta:
        "Sesiones cortas e intensas para mejorar acondicionamiento y quemar calorías.",
      frecuencia: "2-3 veces por semana",
      duracion: "25-35 min",
      imagen: "/imagenes/HIIT.avif",
      enfoque: ["Cardio", "Resistencia", "Core"],
      descripcionLarga:
        "El HIIT combina intervalos de alta intensidad con periodos de descanso, ideal para mejorar el rendimiento cardiovascular y ayudar en la pérdida de grasa.",
      ejercicios: [
        {
          nombre: "Sprint en cinta/bicicleta",
          series: "8-10",
          repeticiones: "20 s ON / 40 s OFF",
          descanso: "-",
        },
        {
          nombre: "Burpees, mountain climbers, jumping jacks (circuito)",
          series: "3-4 vueltas",
          repeticiones: "30 s cada ejercicio",
          descanso: "30-60 s entre vueltas",
        },
      ],
      tips: [
        "No hagas HIIT todos los días; combínalo con cardio suave.",
        "Calienta muy bien antes de empezar para evitar lesiones.",
      ],
    },
    {
      id: "gluteos-pierna",
      nombre: "Glúteos & Piernas Pro",
      nivel: "Intermedio",
      objetivo: "Estética de tren inferior",
      descripcionCorta:
        "Enfoque total en glúteos, cuádriceps e isquios para mejorar forma y fuerza.",
      frecuencia: "3-4 veces por semana",
      duracion: "55-70 min",
      imagen: "/imagenes/Glúteos_Piernas.png",
      enfoque: ["Glúteos", "Piernas", "Core"],
      descripcionLarga:
        "Rutina enfocada al desarrollo de glúteos y piernas con énfasis en ejercicios de empuje de cadera, sentadillas y variaciones de peso muerto.",
      ejercicios: [
        {
          nombre: "Hip thrust",
          series: "4",
          repeticiones: "8-12",
          descanso: "60-90 s",
        },
        {
          nombre: "Sentadilla búlgara",
          series: "3",
          repeticiones: "10-12 por pierna",
          descanso: "60-90 s",
        },
        {
          nombre: "Peso muerto rumano",
          series: "3",
          repeticiones: "8-10",
          descanso: "60-90 s",
        },
      ],
      tips: [
        "Concéntrate en la conexión mente-músculo en cada repetición.",
        "No descuides el fortalecimiento del core para proteger la zona lumbar.",
      ],
    },
  ];

  // que rutinas ve cada plan
  const rutinasPorPlan = {
    invitado: ["full-body-beginner"],
    basic: ["full-body-beginner"],
    intermedio: ["full-body-beginner", "split-clasico", "torso-pierna", "hiit"],
    pro: [
      "full-body-beginner",
      "split-clasico",
      "ppl",
      "torso-pierna",
      "hiit",
      "gluteos-pierna",
    ],
  };

  const [nivelFiltro, setNivelFiltro] = useState("Todos");
  const [rutinaActiva, setRutinaActiva] = useState(null);


  // Normalizar userPlan

  let planKey = "invitado";

  if (userPlan === "basic" || userPlan === 1) {
    planKey = "basic";
  } else if (userPlan === "intermedio" || userPlan === 2) {
    planKey = "intermedio";
  } else if (userPlan === "pro" || userPlan === 3) {
    planKey = "pro";
  }

  const idsPermitidos = rutinasPorPlan[planKey] || [];

  const rutinasPermitidas = rutinasData.filter((r) =>
    idsPermitidos.includes(r.id)
  );

  const rutinasFiltradas =
    nivelFiltro === "Todos"
      ? rutinasPermitidas
      : rutinasPermitidas.filter((r) => r.nivel === nivelFiltro);

  // textos segun plan
  const textoPlan =
    planKey === "invitado"
      ? "Estás en la versión demo. Solo puedes ver una rutina básica. Contrata un plan para desbloquear más contenido."
      : planKey === "basic"
      ? "Tienes el Plan Básico. Aquí están las rutinas incluidas en tu plan."
      : planKey === "intermedio"
      ? "Tienes el Plan Intermedio. Disfruta de rutinas más completas para seguir progresando."
      : "Tienes el Plan PRO. Tienes acceso a todas las rutinas disponibles.";

  const etiquetaPlan =
    planKey === "invitado"
      ? "Sin plan activo"
      : planKey === "basic"
      ? "Plan Básico"
      : planKey === "intermedio"
      ? "Plan Intermedio"
      : "Plan PRO";

  // -------- VISTA DETALLE --------
  if (rutinaActiva) {
    return (
      <main className="rutinas-page">
        <section className="rutinas-header">
          <p className="rutinas-kicker">🏋️ Detalle de rutina</p>
          <h1>{rutinaActiva.nombre}</h1>
          <p className="rutinas-subtitle">
            Nivel: {rutinaActiva.nivel} • Objetivo: {rutinaActiva.objetivo}
          </p>

          <div className="rutinas-plan-info">
            <span className="rutinas-plan-badge">{etiquetaPlan}</span>
            <p>{textoPlan}</p>
          </div>
        </section>

        <section className="rutina-detalle">
          <div className="rutina-detalle-left">
            <div className="rutina-detalle-imagen-wrapper">
              <img
                src={rutinaActiva.imagen}
                alt={rutinaActiva.nombre}
                className="rutina-detalle-imagen"
              />
            </div>

            <div className="rutina-detalle-meta">
              <p>
                <strong>Frecuencia:</strong> {rutinaActiva.frecuencia}
              </p>
              <p>
                <strong>Duración estimada:</strong> {rutinaActiva.duracion}
              </p>
              <p>
                <strong>Enfoque principal:</strong>{" "}
                {rutinaActiva.enfoque.join(" • ")}
              </p>
            </div>
          </div>

          <div className="rutina-detalle-right">
            {/* Descripción arriba */}
            <section className="rutina-detalle-seccion rutina-detalle-seccion--descripcion">
              <h2>¿En qué consiste la rutina?</h2>
              <p>{rutinaActiva.descripcionLarga}</p>
            </section>

            {/* Tabla de ejercicios */}
            {rutinaActiva.ejercicios && (
              <section className="rutina-detalle-seccion rutina-detalle-seccion--tabla">
                <h2>Ejercicios incluidos</h2>
                <table className="rutina-detalle-tabla">
                  <thead>
                    <tr>
                      <th>Ejercicio</th>
                      <th>Series</th>
                      <th>Reps / Tiempo</th>
                      <th>Descanso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rutinaActiva.ejercicios.map((eje, idx) => (
                      <tr key={idx}>
                        <td>{eje.nombre}</td>
                        <td>{eje.series}</td>
                        <td>{eje.repeticiones}</td>
                        <td>{eje.descanso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Tips */}
            {rutinaActiva.tips && (
              <section className="rutina-detalle-seccion rutina-detalle-seccion--tips">
                <h2>Recomendaciones</h2>
                <ul className="rutina-detalle-tips">
                  {rutinaActiva.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="rutina-detalle-footer">
              <button
                type="button"
                className="rutina-card-btn"
                onClick={() => setRutinaActiva(null)}
              >
                ← Volver a todas las rutinas
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // -------- VISTA LISTA --------
  return (
    <main className="rutinas-page">
      <section className="rutinas-header">
        <p className="rutinas-kicker">🏋️ Rutinas disponibles</p>
        <h1>Elige la rutina que más se adapte a tus objetivos.</h1>
        <p className="rutinas-subtitle">
          Diseñadas para diferentes niveles y metas: fuerza, hipertrofia,
          pérdida de grasa y rendimiento.
        </p>

        <div className="rutinas-plan-info">
          <span className="rutinas-plan-badge">{etiquetaPlan}</span>
          <p>{textoPlan}</p>
        </div>
      </section>

      <section className="rutinas-filters">
        <span className="rutinas-filter-label">Filtrar por nivel:</span>
        <select
          className="rutinas-select"
          value={nivelFiltro}
          onChange={(e) => setNivelFiltro(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </section>

      <section className="rutinas-grid">
        {rutinasFiltradas.map((rutina) => (
          <article key={rutina.id} className="rutina-card">
            <div className="rutina-card-image">
              <img src={rutina.imagen} alt={rutina.nombre} />
              <div className="rutina-card-image-overlay" />
              <div className="rutina-card-pill-nivel">
                <span
                  className={`nivel-dot nivel-${rutina.nivel.toLowerCase()}`}
                />
                {rutina.nivel}
              </div>
            </div>

            <div className="rutina-card-body">
              <div className="rutina-card-header">
                <h2>{rutina.nombre}</h2>
                <p className="rutina-card-objetivo">{rutina.objetivo}</p>
              </div>

              <p className="rutina-card-desc">{rutina.descripcionCorta}</p>

              <div className="rutina-card-meta">
                <span>
                  <strong>Frecuencia: </strong>
                  {rutina.frecuencia}
                </span>
                <span>
                  <strong>Duración: </strong>
                  {rutina.duracion}
                </span>
              </div>

              <div className="rutina-card-tags">
                {rutina.enfoque.map((tag) => (
                  <span key={tag} className="rutina-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rutina-card-footer">
                <button
                  type="button"
                  className="rutina-card-btn"
                  onClick={() => setRutinaActiva(rutina)}
                >
                  Ver rutina
                </button>
              </div>
            </div>
          </article>
        ))}

        {rutinasFiltradas.length === 0 && (
          <p className="rutinas-empty">
            No hay rutinas para ese nivel en tu plan actual.
          </p>
        )}
      </section>
    </main>
  );
}
