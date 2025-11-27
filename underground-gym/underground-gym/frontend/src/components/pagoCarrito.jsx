import React, { useMemo, useState } from "react";
import "./styles/pagoCarrito.css";

export default function PagoCarrito({ cart, setCart, setCurrent }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    dui: "",
    tipoEntrega: "envio", 
    departamento: "",
    municipio: "",
    direccion: "",
    numeroTarjeta: "",
    fechaExp: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  // Recuperar items (estado o localStorage)
  const items = useMemo(() => {
    if (cart && cart.length > 0) return cart;
    try {
      const saved = JSON.parse(
        localStorage.getItem("cartForPayment") || "[]"
      );
      return saved;
    } catch {
      return [];
    }
  }, [cart]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // --------- Helpers de formato ---------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted =
      digits.length > 4
        ? `${digits.slice(0, 4)}-${digits.slice(4)}`
        : digits;
    setForm((prev) => ({ ...prev, telefono: formatted }));
  };

  const handleDuiChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    let formatted =
      digits.length > 8
        ? `${digits.slice(0, 8)}-${digits.slice(8)}`
        : digits;
    setForm((prev) => ({ ...prev, dui: formatted }));
  };

  const handleCardChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    let formatted = digits.match(/.{1,4}/g)?.join(" ") || "";
    setForm((prev) => ({ ...prev, numeroTarjeta: formatted }));
  };

  const handleExpiryChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    let month = digits.slice(0, 2);
    let year = digits.slice(2, 4);

    if (month.length === 2) {
      let m = parseInt(month, 10);
      if (m === 0) m = 1;
      if (m > 12) m = 12;
      month = m.toString().padStart(2, "0");
    }

    let formatted = month;
    if (digits.length > 2) formatted += "/" + year;

    setForm((prev) => ({ ...prev, fechaExp: formatted }));
  };

  const handleCvvChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm((prev) => ({ ...prev, cvv: digits }));
  };

  // --------- Envio ---------

  const departamentos = [
    "",
    "San Salvador",
    "La Libertad",
    "Santa Ana",
    "Sonsonate",
    "San Miguel",
    "Usulután",
    "La Paz",
    "Cuscatlán",
    "Ahuachapán",
    "Chalatenango",
    "Cabañas",
    "Morazán",
    "La Unión",
  ];

  const calcularCostoEnvio = (tipoEntrega, departamento, municipio) => {
    if (tipoEntrega === "pickup") return 0;

    if (
      departamento === "San Salvador" &&
      municipio.toLowerCase() === "san salvador"
    ) {
      return 3.0;
    }
    if (departamento === "San Salvador" || departamento === "La Libertad") {
      return 4.0;
    }
    if (!departamento) return 0; // mientras no elijan, no sumamos
    return 5.5; // resto del país
  };

  const costoEnvio = useMemo(
    () =>
      calcularCostoEnvio(
        form.tipoEntrega,
        form.departamento,
        form.municipio || ""
      ),
    [form.tipoEntrega, form.departamento, form.municipio]
  );

  const total = subtotal + costoEnvio;

  // Texto y estilo para la fila de envio
  const envioTexto =
    form.tipoEntrega === "pickup"
      ? "Recoger en gym (Gratis)"
      : costoEnvio > 0
      ? `$${costoEnvio.toFixed(2)}`
      : "Selecciona ubicación";

  const envioPendiente =
    form.tipoEntrega === "envio" &&
    (!form.departamento || !form.municipio);

  // --------- Submit ---------
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!items.length) {
    alert("Tu carrito está vacío.");
    return;
  }

  // Validaciones basicas
  if (!form.nombre || !form.telefono || !form.dui) {
    alert("Completa nombre, teléfono y DUI.");
    return;
  }

  if (form.tipoEntrega === "envio") {
    if (!form.departamento || !form.municipio || !form.direccion) {
      alert(
        "Para envío a domicilio, completa departamento, municipio y dirección."
      );
      return;
    }
  }

  setProcessing(true);

  try {
    const payload = {
      items,
      subtotal,
      costoEnvio,
      total,
      datosCliente: {
        nombre: form.nombre,
        telefono: form.telefono,
        dui: form.dui,
        tipoEntrega: form.tipoEntrega,
        departamento: form.departamento,
        municipio: form.municipio,
        direccion: form.direccion,
      },
    };

    console.log("📦 Enviando venta suplementos:", payload);

    const resp = await fetch(
      "http://localhost:5000/api/admin/ventas-suplementos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok || !data.ok) {
      console.error("❌ Error backend venta:", data);
      throw new Error(data.mensaje || "Error al registrar la venta.");
    }

    alert("Pago realizado con éxito. Gracias por tu compra 💪");

    // Limpiamos carrito en app y en localStorage
    setCart([]);
    localStorage.removeItem("cartForPayment");
    setCurrent("home");
  } catch (err) {
    console.error("❌ Error en handleSubmit:", err);
    alert("Ocurrió un error al procesar el pago.");
  } finally {
    setProcessing(false);
  }
};

  return (
    <main className="checkout-page">
      <section className="checkout-container">
        <header className="checkout-header">
          <h1>Pago del Carrito</h1>
          <p>Revisa tu pedido y completa los datos de envío y pago.</p>
        </header>

        <div className="checkout-layout">
          {/* RESUMEN DE COMPRA */}
          <div className="checkout-summary-card">
            <h2>Resumen de compra</h2>

            {items.length === 0 ? (
              <p className="checkout-empty">
                Tu carrito está vacío. Agrega suplementos desde la tienda.
              </p>
            ) : (
              <>
                <ul className="checkout-items">
                  {items.map((item) => (
                    <li key={item.id} className="checkout-item">
                      <div className="checkout-item-img">
                        {item.img && <img src={item.img} alt={item.name} />}
                      </div>

                      <div className="checkout-item-info">
                        <p className="checkout-item-name">{item.name}</p>
                        <p className="checkout-item-meta">
                          Cantidad: <span>x{item.qty}</span>
                        </p>
                        <p className="checkout-item-meta small">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>

                      <div className="checkout-item-price">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="checkout-total-row">
                  <span>Subtotal productos</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="checkout-total-row">
                  <span>Envío / entrega</span>
                  <span
                    className={
                      envioPendiente ? "checkout-total-pending" : ""
                    }
                  >
                    {envioTexto}
                  </span>
                </div>

                <div className="checkout-total-row checkout-total-row--grand">
                  <span>Total a pagar</span>
                  <span className="checkout-total-amount">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* FORMULARIO */}
          <form className="checkout-form-card" onSubmit={handleSubmit}>
            {/* DATOS CONTACTO / ENTREGA */}
            <h2 className="checkout-section-title">
              Datos de contacto y entrega
            </h2>

            <div className="checkout-field">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                placeholder="Como aparece en tu documento"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  placeholder="7777-7777"
                  value={form.telefono}
                  onChange={handlePhoneChange}
                  maxLength={9}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>DUI</label>
                <input
                  type="text"
                  name="dui"
                  placeholder="00000000-0"
                  value={form.dui}
                  onChange={handleDuiChange}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="checkout-field">
              <label>Tipo de entrega</label>
              <div className="checkout-delivery-options">
                <label>
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="envio"
                    checked={form.tipoEntrega === "envio"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tipoEntrega: e.target.value,
                      }))
                    }
                  />
                  Envío a domicilio
                </label>
                <label>
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="pickup"
                    checked={form.tipoEntrega === "pickup"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tipoEntrega: e.target.value,
                      }))
                    }
                  />
                  Recoger en el gym
                </label>
              </div>
            </div>

            {form.tipoEntrega === "envio" ? (
              <>
                <div className="checkout-row">
                  <div className="checkout-field">
                    <label>Departamento</label>
                    <select
                      name="departamento"
                      value={form.departamento}
                      onChange={handleChange}
                    >
                      {departamentos.map((d) => (
                        <option key={d} value={d}>
                          {d || "Selecciona un departamento"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="checkout-field">
                    <label>Municipio</label>
                    <input
                      type="text"
                      name="municipio"
                      placeholder="Ej. San Salvador"
                      value={form.municipio}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label>Dirección exacta</label>
                  <textarea
                    name="direccion"
                    rows={2}
                    placeholder="Colonia, calle, número de casa, referencias..."
                    value={form.direccion}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <p className="checkout-delivery-note">
                Recogerás tu pedido en <b>UNDERGROUND_gym</b>, San Salvador.
                Te enviaremos los detalles al correo o WhatsApp.
              </p>
            )}

            {/* DATOS DE PAGO */}
            <h2 className="checkout-section-title">Información de pago</h2>

            <div className="checkout-field">
              <label>Nombre en la tarjeta</label>
              <input
                type="text"
                name="nombreTarjeta"
                placeholder="Como aparece en la tarjeta"
                value={form.nombreTarjeta}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-field">
              <label>Número de tarjeta</label>
              <input
                type="text"
                name="numeroTarjeta"
                placeholder="1234 5678 9012 3456"
                value={form.numeroTarjeta}
                onChange={handleCardChange}
                maxLength={19}
                required
              />
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label>Fecha de expiración</label>
                <input
                  type="text"
                  name="fechaExp"
                  placeholder="MM/AA"
                  value={form.fechaExp}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="***"
                  maxLength={4}
                  value={form.cvv}
                  onChange={handleCvvChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="checkout-pay-btn"
              disabled={processing || !items.length}
            >
              {processing ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
            </button>

            <button
              type="button"
              className="checkout-back-btn"
              onClick={() => setCurrent("tienda")}
            >
              Volver a la tienda
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
