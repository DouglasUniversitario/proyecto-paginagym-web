import React from "react";

export default function Pago({ selectedPlan, setCurrent }) {
  return (
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
  );
}
