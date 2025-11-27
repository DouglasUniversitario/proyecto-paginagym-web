import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Inicio from "./components/Inicio";
import Rutinas from "./components/Rutinas";
import Planes from "./components/Planes";
import Suplementos from "./components/Suplementos";
import Contacto from "./components/Contacto";
import Pago from "./components/Pago";
import Login from "./components/Login";
import Perfil from "./components/Perfil";
import CartSidebar from "./components/CartSidebar";
import PagoCarrito from "./components/pagoCarrito";

import FAQ from "./components/FAQ";
import CalculadoraIMC from "./components/CalculadoraIMC";
import Chat from "./components/Chat"; 

// Paneles de administración
import AdminPanel from "./components/AdminPanel";
import AdminVentas from "./components/AdminVentas";
import AdminMensajes from "./components/AdminMensajes";
import AdminCompras from "./components/AdminCompras";
import AdminRutinas from "./components/AdminRutinas";
import AdminPlanes from "./components/AdminPlanes";
import AdminEntrenadores from "./components/AdminEntrenadores"; 

export default function App() {
  const [current, setCurrent] = useState("home");
  const [cart, setCart] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const handleUpdatePhoto = (newPhotoURL) => {
    setUserData((prevData) => ({
      ...prevData,
      foto_url: newPhotoURL,
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({});
    setSelectedPlan(null);
    setCurrent("home");
  };

  const isAdmin = isLoggedIn && userData?.rol === "Admin";

 // Plan activo del usuario (1 = Básico, 2 = Intermedio, 3 = Pro)
const userPlan = isLoggedIn ? userData?.membresia_id_actual || null : null;

 const handlePaymentSuccess = (planId) => {
  setUserData((prev) => ({
    ...prev,
    membresia_activa: planId,       
    membresia_id_actual: planId,    
    estado: "Activo",
  }));
};


  return (
    <div>
      <Navbar
        setCurrent={setCurrent}
        isLoggedIn={isLoggedIn}
        userData={userData}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* INICIO: cliente ve portada, admin ve su panel */}
      {!isAdmin && current === "home" && <Inicio setCurrent={setCurrent} />}
      {isAdmin && current === "home" && <AdminPanel user={userData} />}

      {/* RUTINAS: cliente vs admin */}
      {current === "rutinas" &&
        (isAdmin ? <AdminRutinas /> : <Rutinas userPlan={userPlan} />)}

      {/* PLANES: cliente vs admin */}
       {current === "planes" &&
  (isAdmin ? (
    <AdminPlanes />
  ) : (
    <Planes
      setCurrent={setCurrent}
      setSelectedPlan={setSelectedPlan}
      isLoggedIn={isLoggedIn}
      selectedPlan={selectedPlan}
      userPlanId={userData?.membresia_id_actual || null}  // 👈 IMPORTANTE
    />
  ))}


      {/* ENTRENADORES: SOLO ADMIN */}
      {isAdmin && current === "entrenadores" && <AdminEntrenadores />}

      {/* Suplementos SOLO para clientes */}
      {!isAdmin && current === "tienda" && (
        <Suplementos cart={cart} setCart={setCart} />
      )}

      {/* Compras / gestión de suplementos SOLO para admin */}
      {isAdmin && current === "compras" && <AdminCompras />}

      {/* Pago del carrito de suplementos */}
      {current === "pago-carrito" && (
        <PagoCarrito cart={cart} setCart={setCart} setCurrent={setCurrent} />
      )}

      {/* Formulario de contacto SOLO para usuario */}
      {!isAdmin && current === "contacto" && <Contacto />}

      {/* Pago de plan (solo si hay plan elegido) */}
      {current === "pago" && selectedPlan && (
        <Pago
          selectedPlan={selectedPlan}
          setCurrent={setCurrent}
          userData={userData} // para mostrar nombre/correo en el pago
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* LOGIN */}
      {current === "login" && (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setUserData={setUserData}
          setCurrent={setCurrent}
          selectedPlan={selectedPlan}
        />
      )}

      {/* PERFIL (solo si está logueado) */}
      {current === "perfil" && isLoggedIn && (
        <Perfil
          userData={userData}
          onLogout={handleLogout}
          onUpdatePhoto={handleUpdatePhoto}
        />
      )}

      {/* PANEL GENERAL DE ADMINISTRACIÓN (desde el menú "Panel Administrativo") */}
      {isAdmin && current === "admin" && <AdminPanel user={userData} />}

      {/* PANEL DE VENTAS (solo admin) */}
      {isAdmin && current === "ventas" && <AdminVentas />}

      {/* PANEL DE MENSAJES / COMENTARIOS (solo admin) */}
      {isAdmin && current === "mensajes" && <AdminMensajes />}

      {/* FAQ */}
      {current === "faq" && <FAQ setCurrent={setCurrent} />}

      {/* Calculadora IMC */}
      {current === "imc" && <CalculadoraIMC />}

      {/* CHAT */}
      {current === "chat" && isLoggedIn && <Chat userData={userData} />}

      {/* CARRITO flotante: solo si NO es admin */}
      {!isAdmin && (
        <CartSidebar
          cartItems={cart}
          onUpdateCart={setCart}
          onCheckout={() => setCurrent("pago-carrito")}
        />
      )}

      <footer>
        © {new Date().getFullYear()} <span>UNDERGROUND GYM</span> — Todos los
        derechos reservados.
      </footer>
    </div>
  );
}
