import React from "react";
import { Plus } from "lucide-react";

export default function Suplementos({ cart, setCart }) {
  const products = [
    {
      id: 1,
      name: "Proteína Whey 2lb",
      price: 29.99,
      img: "public/imagenes/Proteina.png",
    },
    {
      id: 2,
      name: "Creatina Monohidratada",
      price: 19.99,
      img: "public/imagenes/Creatine.jpeg",
    },
    {
      id: 3,
      name: "Pre-entreno PSYCHOTIC",
      price: 24.99,
      img: "public/imagenes/Pree.jpeg",
    },
  ];

  const onAdd = (p) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found)
        return prev.map((x) =>
          x.id === p.id ? { ...x, qty: x.qty + 1 } : x
        );
      return [...prev, { ...p, qty: 1 }];
    });
  };

  return (
    <section>
      <h2>Tienda de Suplementos</h2>
      <p>Agrega productos a tu carrito.</p>
      <div className="grid grid-3">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.img} alt={p.name} />
            <div className="card-content">
              <h3>{p.name}</h3>
              <p>${p.price.toFixed(2)}</p>
              <button className="btn btn-primary" onClick={() => onAdd(p)}>
                <Plus size={15} /> Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
