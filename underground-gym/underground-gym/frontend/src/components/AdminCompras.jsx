import React, { useEffect, useState } from "react";
import "./styles/AdminCompras.css";

const API_BASE = "http://localhost:5000/api";

export default function AdminCompras() {
  const [suplementos, setSuplementos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen_url: "",
    activo: true,
  });

  //   Cargar suplementos
 
  const cargarSuplementos = async () => {
    setCargando(true);
    setError("");

    try {
      const resp = await fetch(`${API_BASE}/admin/suplementos`);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.mensaje || "Error al cargar suplementos");
      }

      setSuplementos(data.suplementos || []);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSuplementos();
  }, []);

  //   Formulario

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagen_url: "",
      activo: true,
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock || 0),
      activo: form.activo,
      imagen_url: form.imagen_url,
    };

    const url = editId
      ? `${API_BASE}/admin/suplementos/${editId}`
      : `${API_BASE}/admin/suplementos`;

    const method = editId ? "PUT" : "POST";

    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.mensaje || "Error al guardar suplemento");
      }

      await cargarSuplementos();
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor");
    }
  };

  const handleEditar = (sup) => {
    setEditId(sup.id);
    setForm({
      nombre: sup.nombre,
      descripcion: sup.descripcion || "",
      precio: sup.precio,
      stock: sup.stock,
      imagen_url: sup.imagen_url || "",
      activo: sup.activo === true || sup.activo === 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este suplemento?")) return;

    try {
      const resp = await fetch(`${API_BASE}/admin/suplementos/${id}`, {
        method: "DELETE",
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.mensaje || "Error al eliminar suplemento");
      }

      await cargarSuplementos();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor");
    }
  };

  // KPIs
  const totalProductos = suplementos.length;
  const activos = suplementos.filter(
    (s) => s.activo === true || s.activo === 1
  ).length;

  return (
    <div className="admin-compras">
      <h1 className="admin-title">Gestión de suplementos</h1>
      <p className="admin-subtitle">
        Administra los productos que se muestran en la tienda del usuario.
      </p>

      {/* KPIs */}
      <div className="admin-kpis">
        <div className="kpi-card">
          <span className="kpi-label">Total de productos</span>
          <span className="kpi-value">{totalProductos}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Activos en la tienda</span>
          <span className="kpi-value">{activos}</span>
        </div>
      </div>

      {/* LISTADO */}
      <section className="admin-block">
        <h2>Listado de suplementos</h2>

        {error && <p className="admin-error">{error}</p>}
        {cargando && <p>Cargando suplementos...</p>}

        {!cargando && !error && suplementos.length === 0 && (
          <p>No hay suplementos registrados aún.</p>
        )}

        {!cargando && !error && suplementos.length > 0 && (
          <div className="tabla-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Visible</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {suplementos.map((sup) => (
                  <tr key={sup.id}>
                    <td>{sup.id}</td>
                    <td>
                      <img
                        src={
                          sup.imagen_url && sup.imagen_url.trim() !== ""
                            ? sup.imagen_url
                            : "/default-supplement.png"
                        }
                        alt={sup.nombre}
                        className="supp-thumb"
                      />
                    </td>
                    <td>{sup.nombre}</td>
                    <td>${Number(sup.precio).toFixed(2)}</td>
                    <td>{sup.stock}</td>
                    <td>
                      {sup.activo === true || sup.activo === 1 ? "Sí" : "No"}
                    </td>
                    <td>
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEditar(sup)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleEliminar(sup.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FORMULARIO */}
      <section className="admin-block">
        <h2>{editId ? "Editar suplemento" : "Nuevo suplemento"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row-inline">
            <div>
              <label>Precio ($)</label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="checkbox-row">
              <label>
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                />{" "}
                Visible en la tienda del usuario
              </label>
            </div>
          </div>

          <div className="form-row">
            <label>Imagen (URL)</label>
            <input
              type="text"
              name="imagen_url"
              value={form.imagen_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/whey.png ó /whey.png"
            />
            <small className="hint">
              Puedes usar URLs externas o rutas del proyecto (por ejemplo:
              /whey.webp).
            </small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editId ? "Guardar cambios" : "Agregar suplemento"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={limpiarFormulario}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
