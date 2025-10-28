import React from "react";
import { Dumbbell } from "lucide-react";

export default function Navbar({ setCurrent }) {
  return (
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
  );
}
