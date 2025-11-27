import React, { useEffect, useState } from "react";
import "./styles/Planes.css";

const PLANES = [
  {
    id: "basic",
    membershipId: 1, 
    nombre: "Plan Básico",
    icono: "🥉",
    resumen: "Para empezar tu camino fitness sin complicarte.",
    precio: 9.99,
    features: [
      "Full Body 3x por semana",
      "Asesoría básica de alimentación",
      "Acceso al gym",
      "Chat con entrenador limitado",
    ],
  },
  {
    id: "intermedio",
    membershipId: 2,
    nombre: "Plan Intermedio",
    icono: "🥈",
    resumen: "Para quienes ya entrenan seguido y quieren subir de nivel.",
    precio: 19.99,
    features: [
      "Torso/Pierna o Push–Pull–Legs",
      "Plan nutricional personalizado",
      "Seguimiento semanal",
      "Chat con entrenador 24/7",
    ],
  },
  {
    id: "pro",
    membershipId: 3,
    nombre: "Plan PRO",
    icono: "🏆",
    resumen: "Para atletas y personas que buscan el máximo rendimiento.",
    precio: 29.99,
    features: [
      "Rutina avanzada con HIIT y fuerza",
      "Plan de alimentación + suplementos",
      "Reportes profesionales",
      "Entrenador personal exclusivo",
    ],
  },
];

export default function Planes({
  setCurrent,
  setSelectedPlan,
  isLoggedIn,
  userPlanId, 
}) {
  const [planActivo, setPlanActivo] = useState(null);

  //  Funcion para encontrar el plan activo usando id numerico o string
  const resolverPlanActivo = (idPosible) => {
    if (!idPosible && idPosible !== 0) return null;

    const num =
      typeof idPosible === "string" ? parseInt(idPosible, 10) : idPosible;

    // Busca por id textual (basic/intermedio/pro) o por id numérico (1/2/3)
    return (
      PLANES.find(
        (p) => p.id === idPosible || p.membershipId === num
      ) || null
    );
  };

  // Sincronizar con el valor que viene de App (userData.membresia_id_actual)
  useEffect(() => {
    let candidato = userPlanId;

    // Fallback: intentar leer de localStorage por si el usuario ya estaba logueado
    if (!candidato) {
      try {
        const raw = localStorage.getItem("userData");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.membresia_id_actual) {
            candidato = parsed.membresia_id_actual;
          }
        }
      } catch (e) {
        console.error("Error leyendo userData del localStorage", e);
      }
    }

    const encontrado = resolverPlanActivo(candidato);
    setPlanActivo(encontrado);
  }, [userPlanId]);

  const esClienteConPlan = isLoggedIn && !!planActivo;

  const otrosPlanes = esClienteConPlan
    ? PLANES.filter((p) => p.id !== planActivo.id)
    : PLANES;

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);

    if (!isLoggedIn) {
      setCurrent("login"); // no logueado → login
    } else {
      setCurrent("pago"); // logueado → pago directo
    }
  };

  const nombrePlan = planActivo ? planActivo.nombre : "Ninguno";

  return (
    <main className="planes-page">
      {/* ---------- HERO ---------- */}
      <section className="planes-header">
        <p className="planes-kicker">💳 Membresías Underground Gym</p>
        <h1>Planes pensados para tu nivel y tus objetivos.</h1>
        <p className="planes-subtitle">
          Accede a rutinas, seguimiento y herramientas exclusivas según tu
          plan.
        </p>
      </section>

      {/* ---------- TU PLAN ACTUAL (solo si tiene uno) ---------- */}
      {esClienteConPlan && (
        <section className="planes-section">
          <h2 className="planes-section-title">Tu plan actual</h2>

          <article className="planes-current-card">
            <div className="planes-current-left">
              <span className="planes-current-pill">PLAN ACTIVO</span>
              <h3 className="planes-current-name">
                {planActivo.icono} {planActivo.nombre}
              </h3>
              <p className="planes-current-resumen">
                {planActivo.resumen}
              </p>

              <p className="planes-current-price">
                <span>${planActivo.precio.toFixed(2)}</span> /mes
              </p>

              <p className="planes-current-status">
                Tu plan está activo. Consulta en administración la fecha
                de vencimiento exacta.
              </p>
            </div>

            <div className="planes-current-right">
              <p className="planes-current-list-title">
                ¿Qué incluye tu plan?
              </p>
              <ul className="planes-current-features">
                {planActivo.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      )}

      {/* ---------- OTROS PLANES / TODOS LOS PLANES ---------- */}
      <section className="planes-section">
        <h2 className="planes-section-title">
          {esClienteConPlan
            ? "Otros planes que podrías considerar"
            : "Elige el plan que mejor se adapte a ti"}
        </h2>

        {esClienteConPlan && (
          <p className="planes-section-subtitle">
            Actualmente tienes <strong>{nombrePlan}</strong>. Si quieres
            cambiar tu membresía, puedes elegir alguno de estos planes.
          </p>
        )}

        <div className="planes-grid">
          {otrosPlanes.map((plan) => (
            <article
              key={plan.id}
              className={`planes-card ${
                plan.id === "pro"
                  ? "planes-card--pro"
                  : plan.id === "intermedio"
                  ? "planes-card--middle"
                  : "planes-card--basic"
              }`}
            >
              <div className="planes-card-header">
                <span className="planes-card-icon">{plan.icono}</span>
                <h3>{plan.nombre}</h3>
                {plan.id === "intermedio" && (
                  <span className="planes-card-chip">Más popular</span>
                )}
                {plan.id === "pro" && (
                  <span className="planes-card-chip planes-card-chip--pro">
                    Máximo rendimiento
                  </span>
                )}
              </div>

              <p className="planes-card-resumen">{plan.resumen}</p>

              <p className="planes-card-price">
                <span>${plan.precio.toFixed(2)}</span>
                <span className="planes-card-price-sub">/mes</span>
              </p>

              <ul className="planes-card-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <div className="planes-card-actions">
                <button
                  type="button"
                  className="planes-btn planes-btn--ghost"
                  onClick={() => setCurrent("rutinas")}
                >
                  Ver rutina
                </button>

                <button
                  type="button"
                  className="planes-btn planes-btn--primary"
                  onClick={() => handleSelectPlan(plan)}
                >
                  {esClienteConPlan ? "Cambiar a este plan" : "Suscribirse"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
