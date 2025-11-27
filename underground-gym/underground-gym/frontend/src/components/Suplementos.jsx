import React, { useState } from "react";
import "./styles/Suplementos.css";

export default function Suplementos({ cart, setCart }) {
  const suplementos = [
    {
      id: 1,
      nombre: "Proteína Whey 2lb",
      categoria: "Proteína",
      descripcion:
        "Proteína de suero para recuperación y aumento de masa muscular.",
      precio: 29.99,
      imagen: "/imagenes/Prote.jpg",
      etiqueta: "Más vendido",
    },
    {
      id: 2,
      nombre: "Creatina Monohidratada",
      categoria: "Creatina",
      descripcion:
        "Aumenta fuerza, potencia y rendimiento en entrenamientos intensos.",
      precio: 19.99,
      imagen: "/imagenes/Creatine.jpeg",
      etiqueta: "Top fuerza",
    },
    {
      id: 3,
      nombre: "Pre-entreno PSYCHOTIC",
      categoria: "Pre-entreno",
      descripcion:
        "Energía y enfoque extremos para tus sesiones más pesadas.",
      precio: 24.99,
      imagen: "/imagenes/Pre-entreno.webp",
      etiqueta: "Alta intensidad",
    },
    {
      id: 4,
      nombre: "BCAA 2:1:1",
      categoria: "Aminoácidos",
      descripcion:
        "Aminoácidos de cadena ramificada para reducir la fatiga muscular.",
      precio: 17.5,
      imagen: "/imagenes/8.avif",
      etiqueta: "Recovery",
    },
    {
      id: 5,
      nombre: "Multivitamínico diario",
      categoria: "Vitaminas",
      descripcion:
        "Apoyo general para salud, energía y sistema inmune.",
      precio: 14.99,
      imagen: "/imagenes/13.avif",
      etiqueta: "Esencial",
    },
    {
      id: 6,
      nombre: "Glutamina 300g",
      categoria: "Aminoácidos",
      descripcion:
        "Ayuda a la recuperación muscular y el sistema inmune.",
      precio: 16.99,
      imagen: "/imagenes/Glutamina.avif",
      etiqueta: "",
    },
    {
      id: 7,
      nombre: "Shaker 700ml",
      categoria: "Accesorios",
      descripcion:
        "Vaso mezclador con compartimento para suplementos.",
      precio: 7.99,
      imagen: "/imagenes/Shaker.jpg",
      etiqueta: "Nuevo",
    },
    {
      id: 8,
      nombre: "Barritas de proteína (caja x12)",
      categoria: "Snacks",
      descripcion:
        "Snack rápido con alto contenido de proteína y buen sabor.",
      precio: 21.5,
      imagen: "/imagenes/Barritas.jpg",
      etiqueta: "",
    },
  ];

  const categorias = [
    "Todos",
    "Proteína",
    "Creatina",
    "Pre-entreno",
    "Aminoácidos",
    "Vitaminas",
    "Accesorios",
    "Snacks",
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todos");

  const suplementosFiltrados =
    categoriaSeleccionada === "Todos"
      ? suplementos
      : suplementos.filter((s) => s.categoria === categoriaSeleccionada);

  //  estado global del carrito
  const handleAgregar = (producto) => {
    setCart((prev) => {
      const existente = prev.find((p) => p.id === producto.id);

      if (existente) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [
        ...prev,
        {
          id: producto.id,
          name: producto.nombre,
          price: producto.precio,
          img: producto.imagen,
          qty: 1,
        },
      ];
    });

    // Abrir el carrito automaticamente
    window.dispatchEvent(new Event("open-cart"));
  };

  return (
    <main className="shop-page">
      {/* HEADER */}
      <section className="shop-header">
        <h1>Tienda de Suplementos</h1>
        <p>
          Agrega a tu carrito los suplementos que mejor se adapten a tus
          objetivos de fuerza, volumen o definición.
        </p>
      </section>

      {/* FILTROS */}
      <section className="shop-filters">
        <p className="shop-filters-label">Filtrar por categoría:</p>
        <div className="shop-filter-chips">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={
                "shop-filter-chip" +
                (categoriaSeleccionada === cat
                  ? " shop-filter-chip--active"
                  : "")
              }
              onClick={() => setCategoriaSeleccionada(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRID DE PRODUCTOS */}
      <section className="shop-grid">
        {suplementosFiltrados.map((prod) => (
          <article
            key={prod.id}
            className={
              "shop-card" + (prod.etiqueta ? " shop-card--featured" : "")
            }
          >
            <div className="shop-card-image">
              <img src={prod.imagen} alt={prod.nombre} />
              {prod.etiqueta && (
                <span className="shop-card-tag">{prod.etiqueta}</span>
              )}
            </div>

            <div className="shop-card-body">
              <h3>{prod.nombre}</h3>
              <p className="shop-card-category">{prod.categoria}</p>
              <p className="shop-card-desc">{prod.descripcion}</p>
            </div>

            <div className="shop-card-footer">
              <div className="shop-card-price">
                <span className="shop-card-price-symbol">$</span>
                <span className="shop-card-price-value">
                  {prod.precio.toFixed(2)}
                </span>
              </div>
              <button
                className="shop-card-btn"
                onClick={() => handleAgregar(prod)}
              >
                + Agregar
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
