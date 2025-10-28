import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Inicio from "./components/Inicio";
import Rutinas from "./components/Rutinas";
import Planes from "./components/Planes";
import Suplementos from "./components/Suplementos";
import Carrito from "./components/Carrito";
import Contacto from "./components/Contacto";
import Pago from "./components/Pago";

export default function App() {
  const [current, setCurrent] = useState("home");
  const [cart, setCart] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div>
      <Navbar setCurrent={setCurrent} />

      {current === "home" && <Inicio setCurrent={setCurrent} />}
      {current === "rutinas" && <Rutinas />}
      {current === "planes" && (
        <Planes
          setCurrent={setCurrent}
          setSelectedPlan={setSelectedPlan}
        />
      )}
      {current === "tienda" && <Suplementos cart={cart} setCart={setCart} />}
      {current === "carrito" && <Carrito cart={cart} setCart={setCart} />}
      {current === "contacto" && <Contacto />}
      {current === "pago" && selectedPlan && (
        <Pago selectedPlan={selectedPlan} setCurrent={setCurrent} />
      )}

      <footer>
        © {new Date().getFullYear()} <span>UNDERGROUND GYM</span> — Todos los derechos reservados.
      </footer>
    </div>
  );
}
