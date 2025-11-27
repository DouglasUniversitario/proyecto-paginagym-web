import React, { useEffect, useState } from "react";
import "./styles/AdminPlanes.css";

export default function AdminPlanes() {
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [clientesConPlan, setClientesConPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorPlanes, setErrorPlanes] = useState("");
  const [errorClientes, setErrorClientes] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resPlanes, resClientes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/planes"),
          fetch("http://localhost:5000/api/admin/clientes-planes"),
        ]);

        const dataPlanes = await resPlanes.json();
        const dataClientes = await resClientes.json();

        if (resPlanes.ok) {
          setPlanes(Array.isArray(dataPlanes) ? dataPlanes : dataPlanes.planes || []);
        } else {
          setErrorPlanes(dataPlanes.mensaje || "Error al cargar planes");
        }

        if (resClientes.ok) {
          setClientesConPlan(
            Array.isArray(dataClientes) ? dataClientes : dataClientes.clientes || []
          );
        } else {
          setErrorClientes(
            dataClientes.mensaje || "Error al cargar clientes con plan"
          );
        }
      } catch (err) {
        console.error(err);
        setErrorPlanes("Error al conectar con el servidor");
        setErrorClientes("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const manejarSeleccionPlan = (plan) => {
    setPlanSeleccionado({ ...plan });
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setPlanSeleccionado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!planSeleccionado) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/planes/${planSeleccionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planSeleccionado),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar el plan");

      setPlanes((prev) =>
        prev.map((p) =>
          p.id === planSeleccionado.id ? { ...planSeleccionado } : p
        )
      );

      alert("Plan actualizado correctamente ✅");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al actualizar el plan");
    }
  };

  // Metricas rapidas
  const totalPlanes = planes.length;
  const totalClientes = clientesConPlan.length;
  const activas = clientesConPlan.filter((c) =>
    (c.estado || "").toLowerCase().includes("act")
  ).length;

  return (
    <div className="admin-planes-page">
      {/* HEADER */}
      <header className="admin-planes-header">
        <p className="admin-planes-eyebrow">Panel administrativo</p>
        <h1 className="admin-planes-title">
          Administración de Planes y Membresías
        </h1>
        <p className="admin-planes-sub">
          Gestiona los planes disponibles y revisa qué clientes tienen una
          membresía activa en Underground Gym.
        </p>
      </header>

      {/* MÉTRICAS */}
      <section className="admin-planes-metrics">
        <div className="admin-planes-metric">
          <span className="admin-planes-metric-label">Planes registrados</span>
          <span className="admin-planes-metric-value">{totalPlanes}</span>
        </div>
        <div className="admin-planes-metric">
          <span className="admin-planes-metric-label">Clientes con plan</span>
          <span className="admin-planes-metric-value">{totalClientes}</span>
        </div>
        <div className="admin-planes-metric">
          <span className="admin-planes-metric-label">
            Membresías activas
          </span>
          <span className="admin-planes-metric-value">{activas}</span>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-planes-layout">
        {/* -------- PLANES -------- */}
        <section className="admin-planes-box">
          <div className="admin-planes-box-header">
            <div>
              <h2>Planes registrados</h2>
              <p>Selecciona un plan para modificar precio, descripción, etc.</p>
            </div>
            <span className="admin-pill">
              {totalPlanes} registro{totalPlanes !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && <p className="admin-muted">Cargando información...</p>}
          {errorPlanes && <p className="admin-error">{errorPlanes}</p>}

          {!loading && !errorPlanes && (
            <div className="admin-planes-table-wrapper">
              <table className="admin-planes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th style={{ width: "90px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {planes.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.id}</td>
                      <td>{plan.nombre}</td>
                      <td>{plan.descripcion}</td>
                      <td>
                        $
                        {plan.precio?.toFixed
                          ? plan.precio.toFixed(2)
                          : plan.precio}
                      </td>
                      <td>
                        <button
                          className="admin-btn-small"
                          onClick={() => manejarSeleccionPlan(plan)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {planes.length === 0 && (
                    <tr>
                      <td colSpan="5" className="admin-empty">
                        No hay planes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* FORMULARIO DE EDICIÓN */}
          {planSeleccionado && (
            <form
              onSubmit={guardarCambios}
              className="admin-planes-form"
            >
              <h3>Editar plan: {planSeleccionado.nombre}</h3>

              <div className="admin-planes-form-grid">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="nombre"
                    value={planSeleccionado.nombre || ""}
                    onChange={manejarCambio}
                  />
                </label>

                <label className="admin-planes-form-full">
                  Descripción
                  <textarea
                    name="descripcion"
                    rows={3}
                    value={planSeleccionado.descripcion || ""}
                    onChange={manejarCambio}
                  />
                </label>

                <label>
                  Precio mensual ($)
                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    value={planSeleccionado.precio || ""}
                    onChange={manejarCambio}
                  />
                </label>
              </div>

              <button type="submit" className="admin-planes-save">
                Guardar cambios
              </button>
            </form>
          )}
        </section>

        {/* -------- CLIENTES -------- */}
        <section className="admin-planes-box">
          <div className="admin-planes-box-header">
            <div>
              <h2>Clientes con planes activos</h2>
              <p>Listado de usuarios y la membresía que tienen asignada.</p>
            </div>
          </div>

          {errorClientes && (
            <p className="admin-error">{errorClientes}</p>
          )}

          {!errorClientes && clientesConPlan.length === 0 && (
            <p className="admin-muted">
              No hay clientes con planes asignados.
            </p>
          )}

          {!errorClientes && clientesConPlan.length > 0 && (
            <div className="admin-planes-table-wrapper">
              <table className="admin-planes-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Estado</th>
                    <th>Vence</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesConPlan.map((c) => (
                    <tr key={c.idCliente}>
                      <td>{c.nombreCompleto}</td>
                      <td>{c.email}</td>
                      <td>{c.nombrePlan}</td>
                      <td>
                        <span
                          className={
                            (c.estado || "").toLowerCase().includes("act")
                              ? "estado-pill estado-pill--ok"
                              : "estado-pill estado-pill--warn"
                          }
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td>{c.fechaFin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
