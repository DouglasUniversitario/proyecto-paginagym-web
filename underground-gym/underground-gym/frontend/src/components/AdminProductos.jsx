import React, { useEffect, useState } from "react";
import "./styles/AdminProductos.css";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    precio: "",
    stock: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setMensaje("");
    try {
      const res = await fetch("http://localhost:5000/api/suplementos");
      const data = await res.json();

      // Si tu backend devuelve un array 
      const lista = Array.isArray(data) ? data : data.productos || [];

      // Le inventamos un stock si viene sin el
      const conStock = lista.map((p, idx) => ({
        ...p,
        id: p.id ?? idx + 1,
        stock: p.stock ?? 10,
      }));

      setProductos(conStock);
    } catch (error) {
      console.error(error);
      setMensaje("Error al cargar suplementos");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarForm = () => {
    setForm({ id: null, nombre: "", precio: "", stock: "" });
  };

  const handleEdit = (prod) => {
    setForm({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      stock: prod.stock,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo simulamos el guardado en memoria 
    if (!form.nombre || !form.precio) {
      setMensaje("Completa al menos nombre y precio");
      return;
    }
    
    setProductos((prev) => {
      // Editar
      if (form.id !== null) {
        return prev.map((p) =>
          p.id === form.id ? { ...p, ...form } : p
        );
      }
      // Agregar
      const nuevoId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      return [...prev, { ...form, id: nuevoId }];
    });

    setMensaje("Cambios aplicados (maqueta, falta conectar al backend)");
    limpiarForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="admin-productos">
      <h2>Gestión de suplementos</h2>
      <p>Desde aquí puedes administrar los productos que ve el usuario.</p>

      {mensaje && <p className="mensaje-admin">{mensaje}</p>}

      <section className="admin-productos-grid">
        <div className="admin-productos-form">
          <h3>{form.id ? "Editar producto" : "Nuevo producto"}</h3>
          <form onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Proteína Whey 2lb"
            />

            <label>Precio ($)</label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 29.99"
            />

            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Ej: 10"
            />

            <div className="admin-productos-form-buttons">
              <button type="submit">
                {form.id ? "Actualizar" : "Agregar"}
              </button>
              {form.id && (
                <button type="button" onClick={limpiarForm}>
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-productos-tabla">
          <h3>Listado de suplementos</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>${Number(p.precio).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Editar</button>
                    <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="5">No hay suplementos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
