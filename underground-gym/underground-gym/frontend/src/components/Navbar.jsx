import React from "react";
import "../components/styles/Navbar.css";

export default function Navbar({ setCurrent, isLoggedIn, userData, onLogout }) {
  const isAdmin =
    isLoggedIn && userData && userData.rol && userData.rol === "Admin";

  // --- Datos de plan / estado del usuario ---
  const planId =
    userData && userData.membresia_id_actual != null
      ? Number(userData.membresia_id_actual)
      : null;

  const esClienteActivo =
    isLoggedIn &&
    userData &&
    userData.rol === "Cliente" &&
    userData.estado === "Activo";

  //  IMC solo para clientes con plan activo Intermedio (2) o PRO (3)
  const tieneCalculadoraIMC =
    esClienteActivo && planId && [2, 3].includes(planId); 

  // Chat solo para clientes con plan PRO (3)
  const tieneChatPro = esClienteActivo && planId === 3;

  return (
    <header>
      <nav className="navbar">
        <div className="logo" onClick={() => setCurrent("home")}>
          <img src="/logo1.png" alt="logo" />
          <h1>UNDERGROUND</h1>
          <p>GYM</p>
        </div>

        <ul>
          {/* Inicio SOLO para cliente */}
          {!isAdmin && <li onClick={() => setCurrent("home")}>Inicio</li>}

          <li onClick={() => setCurrent("rutinas")}>Rutinas</li>
          <li onClick={() => setCurrent("planes")}>Planes</li>

          {/* Suplementos (cliente) / Compras (admin) */}
          <li onClick={() => setCurrent(isAdmin ? "compras" : "tienda")}>
            {isAdmin ? "Compras" : "Suplementos"}
          </li>

          {/* Carrito o Ventas según rol */}
          {isAdmin ? (
            <li onClick={() => setCurrent("ventas")}>Ventas</li>
          ) : (
            <li onClick={() => window.dispatchEvent(new Event("open-cart"))}>
              Carrito
            </li>
          )}

          {/* Contacto (usuario) o Comentarios (admin) */}
          {isAdmin ? (
            <li onClick={() => setCurrent("mensajes")}>Comentarios</li>
          ) : (
            <li onClick={() => setCurrent("contacto")}>Contacto</li>
          )}

          {/* FAQ solo para usuarios normales */}
          {!isAdmin && <li onClick={() => setCurrent("faq")}>FAQ</li>}

          {/* Calculadora IMC solo para ciertos planes */}
          {!isAdmin && tieneCalculadoraIMC && (
            <li onClick={() => setCurrent("imc")}>Calculadora IMC</li>
          )}

          {/* Chat solo para plan PRO activo */}
          {!isAdmin && tieneChatPro && (
            <li onClick={() => setCurrent("chat")}>Chat</li>
          )}

          {/* Entrenadores solo para admin */}
          {isAdmin && (
            <li onClick={() => setCurrent("entrenadores")}>Entrenadores</li>
          )}

          {/* Link directo al Panel para admin */}
          {isAdmin && (
            <li onClick={() => setCurrent("admin")}>Panel Administrativo</li>
          )}

          {/* Perfil / Login */}
          {userData && userData.nombre ? (
            <li className="perfil-burbuja">
              <div className="perfil-icono">
                <img
                  src={userData.foto_url || "/default-profile.png"}
                  alt="perfil"
                  className="perfil-mini"
                />
                <span className="perfil-nombre">
                  {userData.nombre.split(" ")[0]}
                </span>
                <ul className="perfil-menu">
                  <li onClick={() => setCurrent("perfil")}>Ver perfil</li>
                  <li onClick={onLogout}>Cerrar sesión</li>
                </ul>
              </div>
            </li>
          ) : (
            <li onClick={() => setCurrent("login")}>Login</li>
          )}
        </ul>
      </nav>
    </header>
  );
}
