import React, { useState } from "react";
import "./styles/Login.css";

export default function Login({
  setIsLoggedIn,
  setUserData,
  setCurrent,
  selectedPlan, 
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    fecha_nacimiento: "",
    genero: "",
    peso: "",
    estatura: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      telefono: "",
      fecha_nacimiento: "",
      genero: "",
      peso: "",
      estatura: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    // En login mandamos solo email + password
    const payload = isRegister
      ? formData
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // REGISTRO
        if (isRegister) {
          // Caso ideal: backend devuelve usuario + token
          if (data.token && data.usuario) {
            localStorage.setItem("token", data.token);
            setUserData(data.usuario);
            setIsLoggedIn(true);
            setMensaje("✅ Registro exitoso.");
            limpiarFormulario();

            setTimeout(() => {
              if (data.usuario.rol === "Admin") {
                setCurrent("admin");
              } else if (data.usuario.rol === "Entrenador") {
                setCurrent("entrenador");
              } else if (data.usuario.rol === "Ventas") {
                setCurrent("ventas");
              } else if (selectedPlan) {
                // cliente normal que viene de un plan
                setCurrent("pago");
              } else {
                setCurrent("perfil");
              }
            }, 1000);
          } else {
            // el backend solo devuelve mensaje 
            if (selectedPlan) {
              // Si venimos de un plan, lo registramos y lo mandamos a pagar
              setUserData({
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                rol: "Cliente",
              });

              setIsLoggedIn(true);
              setMensaje(
                data.mensaje ||
                  "✅ Registro exitoso. Completa el pago para activar tu membresía."
              );
              limpiarFormulario();

              setTimeout(() => {
                setCurrent("pago");
              }, 1200);
            } else {
              // Registro normal sin plan seleccionado
              setMensaje(
                data.mensaje ||
                  "✅ Registro exitoso. Ahora puedes iniciar sesión."
              );
              limpiarFormulario();
              setTimeout(() => {
                setIsRegister(false);
                setMensaje("");
              }, 2500);
            }
          }
        } else {
          //  LOGIN
          setMensaje("✅ Inicio de sesión exitoso");
          limpiarFormulario();

          if (data.token) {
            localStorage.setItem("token", data.token);
          }

          if (data.usuario) {
            setUserData(data.usuario);
          }

          setTimeout(() => {
            setIsLoggedIn(true);

            // Redirigir según rol
            if (data.usuario?.rol === "Admin") {
              setCurrent("admin");
            } else if (data.usuario?.rol === "Entrenador") {
              setCurrent("entrenador");
            } else if (data.usuario?.rol === "Ventas") {
              setCurrent("ventas");
            } else if (selectedPlan) {
              //  cliente normal que viene de un plan
              setCurrent("pago");
            } else {
              setCurrent("perfil");
            }
          }, 1200);
        }
      } else if (!isRegister && response.status === 403) {
        //  Caso especial: cuenta PendientePago
        if (selectedPlan) {
          // Si venimos de un plan, lo mandamos automaticamente a la pantalla de pago
          setMensaje(
            data.mensaje ||
              "Tu cuenta está pendiente de activación. Te enviaremos a la página de pago."
          );

          // Guardamos al menos el email como usuario basico
          setUserData((prev) => {
            if (prev?.email) return prev;
            return { email: formData.email, rol: "Cliente" };
          });

          setTimeout(() => {
            setIsLoggedIn(true);
            setCurrent("pago");
          }, 1500);
        } else {
          // Si no viene de un plan, solo mostramos el mensaje
          setMensaje(
            data.mensaje ||
              "Tu cuenta está pendiente de activación. Por favor, completa el pago."
          );
        }
      } else {
        setMensaje(data.mensaje || "❌ Error en el proceso");
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

      {/* Info del plan seleccionado */}
        {selectedPlan && (
          <p className="login-plan-info">
            Te estás registrando para el{" "}
            <strong>{selectedPlan.nombre}</strong> (${selectedPlan.precio}/mes)
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-grid">
              {/* Campos de registro */}
              <div>
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Darwin"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ej: Ortiz"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Ej: 7777-8888"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label>Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="peso"
                  placeholder="Ej: 72.5"
                  value={formData.peso}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Estatura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  name="estatura"
                  placeholder="Ej: 175"
                  value={formData.estatura}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Ej: correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isRegister ? "Registrarse" : "Entrar"}
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        <p className="toggle">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => setIsRegister(false)}>Inicia sesión</span>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <span onClick={() => setIsRegister(true)}>Regístrate</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
