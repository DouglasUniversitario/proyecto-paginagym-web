import React, { useEffect, useState } from "react";
import "./styles/Pago.css";

export default function Pago({ selectedPlan, setCurrent, userData, onPaymentSuccess }) {
  const [email, setEmail] = useState(userData?.email || "");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Si entran sin plan, regresar a Planes
  useEffect(() => {
    if (!selectedPlan) {
      setCurrent("planes");
    }
  }, [selectedPlan, setCurrent]);

  if (!selectedPlan) return null;

  // -------- FORMATEOS --------
  const handleCardChange = (e) => {
    // Solo digitos, máximo 16
    let digits = e.target.value.replace(/\D/g, "").slice(0, 16);

    // Agrupar en bloques de 4: 1234 5678 9012 3456
    let formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setNumeroTarjeta(formatted);
  };

  const handleFechaChange = (e) => {
    // Solo digitos, máximo 4 (MMYY)
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);

    let formatted;
    if (digits.length >= 3) {
      // 1234 -> 12/34
      formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    } else {
      // 1, 12 -> "1", "12"
      formatted = digits;
    }
    setFechaExpiracion(formatted);
  };

  const handleCvvChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!numeroTarjeta || !fechaExpiracion || !cvv) {
      setError("Completa todos los campos de la tarjeta.");
      return;
    }

    try {
      setLoading(true);

      // Enviar la tarjeta SIN espacios al backend
      const tarjetaLimpia = numeroTarjeta.replace(/\s/g, "");

      const resp = await fetch("http://localhost:5000/api/pagos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          numeroTarjeta: tarjetaLimpia,
          fechaExpiracion,
          cvv,
          total: selectedPlan.precio,
          usuario_id: userData?.id,
          membresia_id: selectedPlan.id,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        throw new Error(data.mensaje || "No se pudo procesar el pago.");
      }

      const nuevoPlanId =
        data?.usuarioActualizado?.membresia_id_actual ??
        data?.membresia_id_actual ??
        selectedPlan.membershipId ??
        selectedPlan.id;

      if (onPaymentSuccess && nuevoPlanId != null) {
        onPaymentSuccess(nuevoPlanId);
      }

      alert("✅ Pago realizado con éxito. ¡Tu plan ha sido activado!");
      setCurrent("planes");
    } catch (err) {
      console.error("Error al confirmar pago:", err);
      setError(err.message || "Error interno al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrent("planes");
  };

  return (
    <main className="pago-page">
      {/* HEADER */}
      <section className="pago-header">
        <p className="pago-kicker">💳 Pago de membresía</p>
        <h1>Completa tu suscripción</h1>
        <p className="pago-subtitle">
          Revisa los datos de tu plan y completa la información de pago.
          Esta pantalla es solo para fines académicos, no se realizan cargos reales.
        </p>
      </section>

      <section className="pago-content">
        {/* CARD DEL PLAN */}
        <article className="pago-plan-card">
          <p className="pago-plan-label">Plan seleccionado</p>
          <h2 className="pago-plan-name">
            {selectedPlan.icono || "🏋️"} {selectedPlan.nombre}
          </h2>

          <p className="pago-plan-price">
            <span>${Number(selectedPlan.precio).toFixed(2)}</span>
            <span>/mes</span>
          </p>

          {selectedPlan.features && (
            <ul className="pago-plan-features">
              {selectedPlan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}

          <p className="pago-plan-note">
            Podrás cambiar de plan más adelante desde la sección <strong>Planes</strong>.
          </p>
        </article>

        {/* CARD DEL FORMULARIO */}
        <article className="pago-form-card">
          <h2>Datos de pago</h2>

          <form onSubmit={handleSubmit} className="pago-form">
            <label className="pago-field">
              <span>Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu_correo@ejemplo.com"
                required
              />
            </label>

            <label className="pago-field">
              <span>Número de tarjeta</span>
              <input
                type="text"
                value={numeroTarjeta}
                onChange={handleCardChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19} // 16 dígitos + 3 espacios
                required
              />
            </label>

            <div className="pago-row">
              <label className="pago-field">
                <span>Fecha de expiración</span>
                <input
                  type="text"
                  value={fechaExpiracion}
                  onChange={handleFechaChange}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </label>

              <label className="pago-field">
                <span>CVC</span>
                <input
                  type="password"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </label>
            </div>

            <div className="pago-resumen">
              <span>Total a pagar</span>
              <strong>${Number(selectedPlan.precio).toFixed(2)}</strong>
            </div>

            {error && <p className="pago-error">{error}</p>}

            <div className="pago-actions">
              <button
                type="button"
                className="pago-btn pago-btn--ghost"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="pago-btn pago-btn--primary"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar pago"}
              </button>
            </div>

            <p className="pago-disclaimer">
              🔒 Tus datos no se almacenan. Simulación de pago para el proyecto
              <strong> Underground Gym</strong>.
            </p>
          </form>
        </article>
      </section>
    </main>
  );
}
