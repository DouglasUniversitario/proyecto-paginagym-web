import React from "react";
import { Minus, Plus } from "lucide-react";

export default function Carrito({ cart, setCart }) {
  const onInc = (p) =>
    setCart((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
    );

  const onDec = (p) =>
    setCart((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x
      )
    );

  const onRemove = (p) =>
    setCart((prev) => prev.filter((x) => x.id !== p.id));

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <section>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>No has agregado productos.</p>
      ) : (
        <>
          <div className="grid">
            {cart.map((c) => (
              <div className="card" key={c.id}>
                <img src={c.img} alt={c.name} />
                <div className="card-content">
                  <h3>{c.name}</h3>
                  <p>${c.price.toFixed(2)} c/u</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn btn-outline" onClick={() => onDec(c)}>
                      <Minus size={14} />
                    </button>
                    <span>{c.qty}</span>
                    <button className="btn btn-outline" onClick={() => onInc(c)}>
                      <Plus size={14} />
                    </button>
                    <button className="btn btn-primary" onClick={() => onRemove(c)}>
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-content" style={{ marginTop: "20px", textAlign: "right" }}>
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </section>
  );
}
