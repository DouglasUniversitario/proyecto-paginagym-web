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
  const [selectedPlan, setSelectedPlan] = useState(null); 

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