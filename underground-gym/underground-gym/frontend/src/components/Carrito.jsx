import React from "react";
import "./styles/Carrito.css";

export default function Carrito({
  isOpen,
  onClose,
  cartItems = [],
  onAddItem,
  onRemoveItem,
  onCheckout,
}) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cantidadTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className={`cart-overlay ${isOpen ? "cart-overlay--open" : ""}`}>
      <aside className={`cart-panel ${isOpen ? "cart-panel--open" : ""}`}>
        {/* HEADER */}
        <header className="cart-header">
          <div>
            <h2>Tu carrito</h2>
            <p>
              {cantidadTotal > 0
                ? `${cantidadTotal} producto${cantidadTotal > 1 ? "s" : ""}`
                : "No hay productos agregados"}
            </p>
          </div>

          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </header>

        {/* CUERPO */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega suplementos o planes para verlos aquí.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <article key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.image && (
                      <img src={item.image} alt={item.name} loading="lazy" />
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>

                    <p className="cart-item-meta">
                      {item.category && <span>{item.category}</span>}
                      <span>${item.price.toFixed(2)}</span>
                    </p>

                    <div className="cart-item-actions">
                      <div className="cart-item-qty">
                        <button
                          onClick={() => onRemoveItem && onRemoveItem(item)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onAddItem && onAddItem(item)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="cart-item-remove"
                        onClick={() =>
                          onRemoveItem && onRemoveItem(item, { removeAll: true })
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* FOOTER / RESUMEN */}
            <footer className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="cart-summary-note">
                Impuestos y envío se calculan en el siguiente paso.
              </p>

              <button className="cart-checkout" onClick={onCheckout}>
                Continuar al pago
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
