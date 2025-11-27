import React, { useEffect, useState } from "react";
import "./styles/AdminEntrenadores.css";

export default function AdminEntrenadores() {
  const [entrenadores, setEntrenadores] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    especialidad: "",
    horario: "",
    telefono: "",
    email: "",
    estado: "Activo",
  });
  const [modoEdicion, setModoEdicion] = useState(false);


  //   Cargar entrenadores

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/entrenadores")
      .then((res) => res.json())
      .then((data) => {
        // Soporta tanto [ ... ] como { entrenadores: [...] }
        setEntrenadores(data.entrenadores || data || []);
      })
      .catch((err) => console.error("Error cargando entrenadores:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setFormData({
      id: null,
      nombre: "",
      especialidad: "",
      horario: "",
      telefono: "",
      email: "",
      estado: "Activo",
    });
    setModoEdicion(false);
  };


  //   Crear / actualizar

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && formData.id != null) {
        // PUT
        const res = await fetch(
          `http://localhost:5000/api/admin/entrenadores/${formData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!res.ok) throw new Error("Error al actualizar entrenador");
        const data = await res.json();
        setEntrenadores((prev) =>
          prev.map((t) => (t.id === data.entrenador.id ? data.entrenador : t))
        );
        alert("Entrenador actualizado ✅");
      } else {
        // POST
        const res = await fetch(
          "http://localhost:5000/api/admin/entrenadores",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!res.ok) throw new Error("Error al crear entrenador");
        const data = await res.json();
        setEntrenadores((prev) => [...prev, data.entrenador]);
        alert("Entrenador creado ✅");
      }
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el entrenador");
    }
  };

  const handleEditar = (entrenador) => {
    setFormData({ ...entrenador });
    setModoEdicion(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este entrenador?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/entrenadores/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar entrenador");
      setEntrenadores((prev) => prev.filter((t) => t.id !== id));
      alert("Entrenador eliminado ✅");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar el entrenador");
    }
  };

  const totalEntrenadores = entrenadores.length;
  const activos = entrenadores.filter((t) => t.estado === "Activo").length;
  const inactivos = totalEntrenadores - activos;

  return (
    <main className="trainers-page">
      {/* HEADER */}
      <header className="trainers-header">
        <div>
          <p className="trainers-kicker">Panel administrativo</p>
          <h1>Gestión de Entrenadores</h1>
          <p className="trainers-subtitle">
            Administra el listado de entrenadores, sus especialidades, horarios
            y estado.
          </p>
        </div>

        <div className="trainers-metrics">
          <div className="trainers-metric-card">
            <span className="trainers-metric-label">Total</span>
            <span className="trainers-metric-value">
              {totalEntrenadores}
            </span>
          </div>
          <div className="trainers-metric-card trainers-metric-card--green">
            <span className="trainers-metric-label">Activos</span>
            <span className="trainers-metric-value">{activos}</span>
          </div>
          <div className="trainers-metric-card trainers-metric-card--yellow">
            <span className="trainers-metric-label">Inactivos</span>
            <span className="trainers-metric-value">{inactivos}</span>
          </div>
        </div>
      </header>

      {/* LAYOUT: TABLA + FORM */}
      <section className="trainers-layout">
        {/* TABLA */}
        <section className="trainers-card trainers-card--table">
          <div className="trainers-card-header">
            <h2>Entrenadores registrados</h2>
            <span className="trainers-badge-count">
              {totalEntrenadores}{" "}
              {totalEntrenadores === 1 ? "registro" : "registros"}
            </span>
          </div>

          <div className="trainers-table-wrapper">
            <table className="trainers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Horario</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th className="trainers-col-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entrenadores.length === 0 && (
                  <tr>
                    <td colSpan="8" className="trainers-empty">
                      No hay entrenadores registrados.
                    </td>
                  </tr>
                )}

                {entrenadores.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.nombre}</td>
                    <td>{t.especialidad}</td>
                    <td>{t.horario}</td>
                    <td>{t.telefono}</td>
                    <td>{t.email}</td>
                    <td>
                      <span
                        className={
                          "trainers-status-pill " +
                          (t.estado === "Activo"
                            ? "trainers-status-pill--active"
                            : "trainers-status-pill--inactive")
                        }
                      >
                        {t.estado}
                      </span>
                    </td>
                    <td>
                      <div className="trainers-actions">
                        <button
                          className="trainers-btn-edit"
                          type="button"
                          onClick={() => handleEditar(t)}
                        >
                          Editar
                        </button>
                        <button
                          className="trainers-btn-delete"
                          type="button"
                          onClick={() => handleEliminar(t.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className="trainers-card trainers-card--form">
          <h2>
            {modoEdicion ? "Editar entrenador" : "Agregar nuevo entrenador"}
          </h2>
          <p className="trainers-form-subtitle">
            {modoEdicion
              ? "Actualiza los datos del entrenador seleccionado."
              : "Completa los datos básicos para registrar un nuevo entrenador."}
          </p>

          <form className="trainers-form" onSubmit={handleSubmit}>
            <div className="trainers-form-grid">
              <div className="trainers-form-field">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Carlos López"
                  required
                />
              </div>

              <div className="trainers-form-field">
                <label>Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  placeholder="Ej: Fuerza, HIIT, Full Body"
                  required
                />
              </div>

              <div className="trainers-form-field">
                <label>Horario</label>
                <input
                  type="text"
                  name="horario"
                  placeholder="Ej: Lunes a Viernes 6:00 - 8:00"
                  value={formData.horario}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="trainers-form-field">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 7777-8888"
                />
              </div>

              <div className="trainers-form-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: entrenador@underground.com"
                />
              </div>

              <div className="trainers-form-field">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="trainers-form-actions">
              <button type="submit" className="trainers-btn-primary">
                {modoEdicion ? "Guardar cambios" : "Crear entrenador"}
              </button>

              {modoEdicion && (
                <button
                  type="button"
                  className="trainers-btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
