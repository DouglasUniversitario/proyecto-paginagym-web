import React, { useEffect, useState } from "react";
import "./styles/AdminRutinas.css";

export default function AdminRutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    nivel: "Principiante",
    entrenador: "",
    diaSemana: "",
    horaInicio: "",
    horaFin: "",
    estadoEntrenador: "Disponible",
  });

  // Carga de rutinas con protección por si el backend no devuelve un array
  useEffect(() => {
    const cargarRutinas = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/rutinas");
        const data = await res.json();
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.rutinas)
          ? data.rutinas
          : [];

        setRutinas(lista);
      } catch (err) {
        console.error("Error cargando rutinas:", err);
        setError("Error al conectar con el servidor");
        setRutinas([]); // Para que no reviente el .map
      }
    };

    cargarRutinas();
  }, []);

  const rutinasFiltradas =
    filtroEstado === "Todos"
      ? rutinas
      : rutinas.filter((r) => r.estadoEntrenador === filtroEstado);

  const totalRutinas = rutinas.length;
  const disponibles = rutinas.filter(
    (r) => r.estadoEntrenador === "Disponible"
  ).length;
  const ocupados = rutinas.filter(
    (r) => r.estadoEntrenador === "Ocupado"
  ).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      id: null,
      nombre: "",
      nivel: "Principiante",
      entrenador: "",
      diaSemana: "",
      horaInicio: "",
      horaFin: "",
      estadoEntrenador: "Disponible",
    });
    setModoEdicion(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modoEdicion && formData.id != null) {
        const res = await fetch(
          `http://localhost:5000/api/admin/rutinas/${formData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!res.ok) throw new Error("Error al actualizar rutina");
        const data = await res.json();

        const rutinaActualizada = data.rutina || data; 
        setRutinas((prev) =>
          prev.map((r) => (r.id === rutinaActualizada.id ? rutinaActualizada : r))
        );
        alert("Rutina actualizada ✅");
      } else {
        const res = await fetch("http://localhost:5000/api/admin/rutinas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Error al crear rutina");
        const data = await res.json();

        const nueva = data.rutina || data;
        setRutinas((prev) => [...prev, nueva]);
        alert("Rutina creada ✅");
      }

      limpiarFormulario();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error guardando la rutina");
    }
  };

  const handleEditar = (rutina) => {
    setFormData({ ...rutina });
    setModoEdicion(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta rutina?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/rutinas/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Error al eliminar rutina");

      setRutinas((prev) => prev.filter((r) => r.id !== id));
      alert("Rutina eliminada ✅");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error eliminando la rutina");
    }
  };

  return (
    <div className="admin-rutinas-page">
      <header className="admin-rutinas-header">
        <p className="admin-rutinas-eyebrow">Panel administrativo</p>
        <h1 className="admin-rutinas-title">Gestión de Rutinas y Horarios</h1>
        <p className="admin-rutinas-sub">
          Administra los horarios en los que los entrenadores dan apoyo, su
          disponibilidad y el nivel de cada rutina.
        </p>
      </header>

      {/* Tarjetas de métricas */}
      <section className="admin-rutinas-metrics">
        <div className="admin-rutinas-metric">
          <span className="admin-rutinas-metric-label">Total de rutinas</span>
          <span className="admin-rutinas-metric-value">{totalRutinas}</span>
        </div>
        <div className="admin-rutinas-metric">
          <span className="admin-rutinas-metric-label">
            Entrenadores libres
          </span>
          <span className="admin-rutinas-metric-value">{disponibles}</span>
        </div>
        <div className="admin-rutinas-metric">
          <span className="admin-rutinas-metric-label">
            Entrenadores ocupados
          </span>
          <span className="admin-rutinas-metric-value">{ocupados}</span>
        </div>
      </section>

      {/* Filtro */}
      <section className="admin-rutinas-filter">
        <label>Filtrar por estado del entrenador:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="Ocupado">Ocupado</option>
        </select>
      </section>

      {/* Layout principal: tabla + formulario */}
      <main className="admin-rutinas-layout">
        {/* Tabla */}
        <section className="admin-rutinas-box">
          <div className="admin-rutinas-box-header">
            <div>
              <h2>Rutinas programadas</h2>
              <p>
                Visualiza y edita las rutinas asociadas a cada entrenador y
                horario.
              </p>
            </div>
            <span className="admin-rutinas-pill">
              {rutinasFiltradas.length} registro
              {rutinasFiltradas.length !== 1 ? "s" : ""}
            </span>
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-rutinas-table-wrapper">
            <table className="admin-rutinas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Rutina</th>
                  <th>Nivel</th>
                  <th>Entrenador</th>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Estado entrenador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rutinasFiltradas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.nombre}</td>
                    <td>{r.nivel}</td>
                    <td>{r.entrenador}</td>
                    <td>{r.diaSemana}</td>
                    <td>
                      {r.horaInicio} - {r.horaFin}
                    </td>
                    <td>
                      <span
                        className={
                          r.estadoEntrenador === "Disponible"
                            ? "estado-pill estado-pill--ok"
                            : "estado-pill estado-pill--warn"
                        }
                      >
                        {r.estadoEntrenador}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditar(r)}
                        className="admin-rutinas-btn-small"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(r.id)}
                        className="admin-rutinas-btn-small admin-rutinas-btn-danger"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {rutinasFiltradas.length === 0 && !error && (
                  <tr>
                    <td colSpan="8" className="admin-empty">
                      No hay rutinas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Formulario */}
        <section className="admin-rutinas-box">
          <div className="admin-rutinas-box-header">
            <div>
              <h2>{modoEdicion ? "Editar rutina" : "Agregar nueva rutina"}</h2>
              <p>
                Completa los campos para crear una rutina o actualizar la
                información de una existente.
              </p>
            </div>
          </div>

          <form className="admin-rutinas-form" onSubmit={handleSubmit}>
            <div className="admin-rutinas-form-grid">
              <label>
                Nombre de la rutina
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Full Body Lunes y Miércoles"
                />
              </label>

              <label>
                Nivel
                <select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </label>

              <label>
                Entrenador
                <input
                  type="text"
                  name="entrenador"
                  value={formData.entrenador}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Carlos López"
                />
              </label>

              <label>
                Día de la semana
                <input
                  type="text"
                  name="diaSemana"
                  placeholder="Ej: Lunes, Miércoles y Viernes"
                  value={formData.diaSemana}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Hora inicio
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Hora fin
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Estado del entrenador
                <select
                  name="estadoEntrenador"
                  value={formData.estadoEntrenador}
                  onChange={handleChange}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Ocupado">Ocupado</option>
                </select>
              </label>
            </div>

            <div className="admin-rutinas-form-actions">
              <button type="submit" className="admin-rutinas-save">
                {modoEdicion ? "Guardar cambios" : "Crear rutina"}
              </button>

              {modoEdicion && (
                <button
                  type="button"
                  className="admin-rutinas-cancel"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
