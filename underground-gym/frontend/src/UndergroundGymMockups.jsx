import React, { useState } from "react";
import {
  Dumbbell,
  ShoppingCart,
  Plus,
  Minus,
  Mail,
} from "lucide-react";

export default function UndergroundGymMockups() {
  const [current, setCurrent] = useState("home");
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [selectedPlan, setSelectedPlan] = useState(null); // 🆕 Plan seleccionado para pago

  const products = [
    {
      id: 1,
      name: "Proteína Whey 2lb",
      price: 29.99,
      img: "public/imagenes/Proteina.png",
    },
    {
      id: 2,
      name: "Creatina Monohidratada",
      price: 19.99,
      img: "public/imagenes/Creatine.jpeg",
    },
    {
      id: 3,
      name: "Pre-entreno PSYCHOTIC",
      price: 24.99,
      img: "public/imagenes/Pree.jpeg",
    },
  ];

  const routinesSeed = [
    {
      id: 1,
      title: "Full Body",
      level: "Principiante",
      focus: "Cuerpo completo",
      img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
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
      img: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1200&auto=format&fit=crop",
      desc: "Días divididos en empuje, jalón y piernas. Ideal para progresar rápido.",
    },
    {
      id: 4,
      title: "Torso – Pierna",
      level: "Intermedio",
      focus: "Fuerza y estética",
      img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop",
      desc: "Alterna torso y piernas 4 días por semana para balance total.",
    },
    {
      id: 5,
      title: "Fuerza (Powerlifting 5x5)",
      level: "Avanzado",
      focus: "Rendimiento",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
      desc: "Entrenamiento de alta carga con foco en sentadilla, banca y peso muerto.",
    },
    {
      id: 6,
      title: "Definición (HIIT)",
      level: "Intermedio",
      focus: "Bajar grasa",
      img: "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=1200&auto=format&fit=crop",
      desc: "Entrenamientos cortos e intensos con enfoque en definición muscular.",
    },
    {
      id: 7,
      title: "Funcional o Resistencia",
      level: "Todos los niveles",
      focus: "Acondicionamiento",
      img: "public/Rutinas/funcional.jpeg",
      desc: "Ejercicios funcionales como burpees, cuerdas, kettlebells y planchas.",
    },
  ];

  const onAdd = (p) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found)
        return prev.map((x) =>
          x.id === p.id ? { ...x, qty: x.qty + 1 } : x
        );
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const onInc = (p) =>
    setCart((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
    );

  const onDec = (p) =>
    setCart((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x
      )
    );

  const onRemove = (p) =>
    setCart((prev) => prev.filter((x) => x.id !== p.id));

  const filteredRoutines =
    filter === "Todos"
      ? routinesSeed
      : routinesSeed.filter((r) => r.level === filter);

  return (
    <div>
      {/* NAVBAR */}
      <header>
        <nav>
          <div className="logo">
            <div className="logo-icon">
              <Dumbbell color="white" size={20} />
            </div>
            <div className="logo-text">
              <h1>UNDERGROUND</h1>
              <span>Gym</span>
            </div>
          </div>
          <ul>
            <li onClick={() => setCurrent("home")}>Inicio</li>
            <li onClick={() => setCurrent("rutinas")}>Rutinas</li>
            <li onClick={() => setCurrent("planes")}>Planes</li>
            <li onClick={() => setCurrent("tienda")}>Suplementos</li>
            <li onClick={() => setCurrent("carrito")}>Carrito</li>
            <li onClick={() => setCurrent("contacto")}>Contacto</li>
          </ul>
        </nav>
      </header>

      {/* HOME */}
      {current === "home" && (
        <section className="hero">
          <h1>
            Entrena duro. Vive <span>UNDERGROUND</span>.
          </h1>
          <p>
            Rutinas, alimentación y suplementos diseñados para maximizar tu
            rendimiento físico.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => setCurrent("rutinas")}
            >
              Empieza ahora
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setCurrent("planes")}
            >
              Ver planes
            </button>
          </div>
        </section>
      )}

      {/* RUTINAS */}
      {current === "rutinas" && (
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
      )}

      {/* PLANES / MEMBRESÍAS */}
      {current === "planes" && (
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
      )}

      {/* PAGO */}
      {current === "pago" && selectedPlan && (
        <section className="payment-section">
          <h2>Pago de Membresía</h2>
          <div className="payment-card">
            <h3>{selectedPlan.name}</h3>
            <p>{selectedPlan.description}</p>
            <p className="price">
              Total a pagar: <strong>${selectedPlan.price.toFixed(2)}</strong> / mes
            </p>

            <form
              className="payment-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert(`✅ Pago exitoso del ${selectedPlan.name} por $${selectedPlan.price}`);
                setCurrent("home");
              }}
            >
              <input type="text" placeholder="Nombre completo" required />
              <input type="email" placeholder="Correo electrónico" required />
              <input type="text" placeholder="Número de tarjeta" maxLength="16" required />
              <div className="payment-row">
                <input type="text" placeholder="MM/AA" maxLength="5" required />
                <input type="text" placeholder="CVC" maxLength="3" required />
              </div>

              <button type="submit" className="btn btn-primary">
                Confirmar pago
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCurrent("planes")}
              >
                Cancelar
              </button>
            </form>
          </div>
        </section>
      )}

      {/* TIENDA */}
      {current === "tienda" && (
        <section>
          <h2>Tienda de Suplementos</h2>
          <p>Agrega productos a tu carrito.</p>
          <div className="grid grid-3">
            {products.map((p) => (
              <div className="card" key={p.id}>
                <img src={p.img} alt={p.name} />
                <div className="card-content">
                  <h3>{p.name}</h3>
                  <p>${p.price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => onAdd(p)}
                  >
                    <Plus size={15} /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CARRITO */}
      {current === "carrito" && (
        <section>
          <h2>Carrito</h2>
          {cart.length === 0 ? (
            <p>No has agregado productos.</p>
          ) : (
            <div className="grid">
              {cart.map((c) => (
                <div className="card" key={c.id}>
                  <img src={c.img} alt={c.name} />
                  <div className="card-content">
                    <h3>{c.name}</h3>
                    <p>${c.price.toFixed(2)} c/u</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => onDec(c)}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{c.qty}</span>
                      <button
                        className="btn btn-outline"
                        onClick={() => onInc(c)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => onRemove(c)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* CONTACTO */}
      {current === "contacto" && (
        <section>
          <h2>Contacto</h2>
          <p>Estamos para ayudarte. Escríbenos.</p>
          <form className="grid">
            <input type="text" placeholder="Tu nombre" className="card-content" />
            <input type="email" placeholder="Tu correo" className="card-content" />
            <textarea placeholder="Tu mensaje" rows="4" className="card-content"></textarea>
            <button className="btn btn-primary">Enviar</button>
          </form>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        © {new Date().getFullYear()} <span>UNDERGROUND GYM</span> — Todos los derechos reservados.
      </footer>
    </div>
  );
}
