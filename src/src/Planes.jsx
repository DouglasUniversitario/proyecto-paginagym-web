import React from "react";

export default function Planes({ setCurrent, setSelectedPlan }) {
  return (
    <section className="membership-section">
      <h2>Planes y Membresías</h2>
      <p>Elige el plan que mejor se adapte a tu nivel y objetivos. 💪</p>

      <div className="grid grid-3 membership-grid">
        {/* PLAN BÁSICO */}
        <div className="membership-card basic">
          <h3>🥉 Plan Básico</h3>
          <p className="desc">
            Ideal para quienes recién inician su camino fitness.
          </p>
          <ul>
            <li>🏋️ Entrenamientos Full Body 3x semana</li>
            <li>🕓 Asesoría básica de alimentación</li>
            <li>📅 Acceso mensual</li>
            <li>💬 Chat con entrenador (limitado)</li>
          </ul>
          <div className="price">
            <span>$9.99</span>
            <small>/mes</small>
          </div>
          <button className="btn btn-outline" onClick={() => setCurrent("rutinas")}>
            Ver Rutina
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedPlan({
                name: "Plan Básico",
                price: 9.99,
                description: "Entrenamientos Full Body + asesoría básica.",
              });
              setCurrent("pago");
            }}
          >
            Suscribirse
          </button>
        </div>

        {/* PLAN INTERMEDIO */}
        <div className="membership-card intermediate">
          <h3>🥈 Plan Intermedio</h3>
          <p className="desc">
            Perfecto para quienes ya entrenan regularmente.
          </p>
          <ul>
            <li>💪 Rutina Torso/Pierna o Push-Pull-Legs</li>
            <li>🥗 Plan nutricional personalizado</li>
            <li>📈 Seguimiento semanal de progreso</li>
            <li>💬 Chat con entrenador 24/7</li>
          </ul>
          <div className="price">
            <span>$19.99</span>
            <small>/mes</small>
          </div>
          <button className="btn btn-outline" onClick={() => setCurrent("rutinas")}>
            Ver Rutina
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedPlan({
                name: "Plan Intermedio",
                price: 19.99,
                description: "Rutina Torso/Pierna + seguimiento semanal.",
              });
              setCurrent("pago");
            }}
          >
            Suscribirse
          </button>
        </div>

        {/* PLAN PRO */}
        <div className="membership-card pro">
          <h3>🏆 Plan PRO</h3>
          <p className="desc">
            Diseñado para atletas o quienes buscan resultados máximos.
          </p>
          <ul>
            <li>🔥 Rutina avanzada con HIIT y fuerza</li>
            <li>🥩 Plan de alimentación + suplementos</li>
            <li>📊 Reportes de progreso profesional</li>
            <li>🎯 Entrenador personal exclusivo</li>
          </ul>
          <div className="price">
            <span>$29.99</span>
            <small>/mes</small>
          </div>
          <button className="btn btn-outline" onClick={() => setCurrent("rutinas")}>
            Ver Rutina
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedPlan({
                name: "Plan PRO",
                price: 29.99,
                description: "HIIT avanzado + entrenador personal exclusivo.",
              });
              setCurrent("pago");
            }}
          >
            Suscribirse
          </button>
        </div>
      </div>
    </section>
  );
}
