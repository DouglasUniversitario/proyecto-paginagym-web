import React, { useState, useEffect } from "react";
import "./styles/cartSidebar.css";

export function simulatePayment({ amount, delayMs = 1200 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random();
      if (rnd < 1 / 3) {
        reject({ message: "El pago ha fallado (simulado)." });
      } else {
        resolve({ message: "Pago aprobado (simulado)." });
      }
    }, delayMs);
  });
}

export default function CartSidebar({
  cartItems = [],
  onUpdateCart,
  onCheckout,
}) {
  const [open, setOpen] = useState(false);

  // Escuchar eventos globales: abrir carrito + agregar al carrito
  useEffect(() => {
    const openListener = () => setOpen(true);

    const addToCartListener = (event) => {
      if (!onUpdateCart) return;

      const prod = event.detail;
      if (!prod || !prod.id) return;

      // Usamos el cartItems ACTUAL (viene por las dependencias del useEffect)
      const existente = cartItems.find((p) => p.id === prod.id);
      let nuevoCarrito;

      if (existente) {
        // Si ya existe, solo aumentamos la cantidad
        nuevoCarrito = cartItems.map((p) =>
          p.id === prod.id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        // Si no existe, lo agregamos con qty = 1
        nuevoCarrito = [
          ...cartItems,
          {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            img: prod.img,
            qty: 1,
          },
        ];
      }

      onUpdateCart(nuevoCarrito);
      setOpen(true); // Abrir carrito al agregar algo
    };

    window.addEventListener("open-cart", openListener);
    window.addEventListener("add-to-cart", addToCartListener);

    return () => {
      window.removeEventListener("open-cart", openListener);
      window.removeEventListener("add-to-cart", addToCartListener);
    };
  }, [cartItems, onUpdateCart]);

  const total = cartItems.reduce((acc, p) => acc + p.price * p.qty, 0);
  const totalQty = cartItems.reduce((acc, p) => acc + p.qty, 0);

  const changeQty = (id, delta) => {
    if (!onUpdateCart) return;
    onUpdateCart(
      cartItems.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );
  };

  const removeItem = (id) => {
    if (!onUpdateCart) return;
    onUpdateCart(cartItems.filter((p) => p.id !== id));
  };

  const handlePay = () => {
    if (!cartItems.length) return;

    // Guardar carrito para usarlo en la pantalla de pago
    localStorage.setItem("cartForPayment", JSON.stringify(cartItems));

    setOpen(false);
    if (onCheckout) onCheckout();
  };

  return (
    <>
      {/* Boton flotante para abrir carrito */}
      <button className="cart-open-btn" onClick={() => setOpen(true)}>
        Abrir carrito ({totalQty})
      </button>

      {/* Overlay + panel lateral */}
      <div
        className={`cart-overlay ${open ? "cart-overlay--open" : ""}`}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`cart-panel ${open ? "cart-panel--open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <header className="cart-header">
            <div>
              <h2>Tu carrito</h2>
              <p>
                {totalQty > 0
                  ? `${totalQty} producto${totalQty > 1 ? "s" : ""}`
                  : "No hay productos agregados"}
              </p>
            </div>

            <button
              className="cart-close"
              onClick={() => setOpen(false)}
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
                      {item.img && (
                        <img src={item.img} alt={item.name} loading="lazy" />
                      )}
                    </div>

                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>

                      <p className="cart-item-meta">
                        <span>${item.price.toFixed(2)}</span>
                      </p>

                      <div className="cart-item-actions">
                        <div className="cart-item-qty">
                          <button onClick={() => changeQty(item.id, -1)}>
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)}>
                            +
                          </button>
                        </div>

                        <button
                          className="cart-item-remove"
                          onClick={() => removeItem(item.id)}
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

                <button className="cart-checkout" onClick={handlePay}>
                  Continuar al pago
                </button>
              </footer>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
