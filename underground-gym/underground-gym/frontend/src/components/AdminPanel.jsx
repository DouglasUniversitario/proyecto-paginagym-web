import React, { useEffect, useState } from "react";
import "./styles/AdminPanel.css";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true);

        //  Pedimos usuarios y planes en paralelo
        const [respUsers, respPlanes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/usuarios"),
          fetch("http://localhost:5000/api/admin/planes"),
        ]);

        const dataUsers = await respUsers.json();
        const dataPlanes = await respPlanes.json();

        // ---- USUARIOS ----
        if (!respUsers.ok || dataUsers.ok === false) {
          throw new Error(dataUsers.mensaje || "Error al cargar usuarios");
        }
        setUsuarios(dataUsers.usuarios || []);

        // ---- PLANES ----
        let planesList = [];
        if (Array.isArray(dataPlanes)) {
          planesList = dataPlanes;
        } else if (Array.isArray(dataPlanes.planes)) {
          planesList = dataPlanes.planes;
        }

        console.log("Planes cargados en AdminPanel:", planesList);
        setPlanes(planesList);

        if (!respPlanes.ok || dataPlanes.ok === false) {
          throw new Error(dataPlanes.mensaje || "Error al cargar planes");
        }

        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  // Totales
  const totalUsuarios = usuarios.length;
  const activos = usuarios.filter((u) => u.estado === "Activo").length;
  const pendientes = usuarios.filter((u) => u.estado === "PendientePago").length;

  // Filtro por nombre/email
  const filtroLower = filtroNombre.toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre || ""} ${u.apellido || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    return (
      nombreCompleto.includes(filtroLower) || email.includes(filtroLower)
    );
  });

  const handleActualizar = async (usuarioId, nuevoEstado, nuevoPlanId) => {
    try {
      setSavingId(usuarioId);

      const resp = await fetch(
        `http://localhost:5000/api/admin/usuarios/${usuarioId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estado: nuevoEstado,
            membresia_id_actual: nuevoPlanId || null,
          }),
        }
      );

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        throw new Error(data.mensaje || "Error al actualizar usuario");
      }

      const usuarioActualizado = data.usuario;

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuarioActualizado.id ? { ...u, ...usuarioActualizado } : u
        )
      );

      alert("Usuario actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al actualizar usuario");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-bg">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h2>Panel de Administración</h2>
          <p className="admin-subtitle">
            Gestiona los usuarios registrados y activa planes pagados en efectivo.
          </p>
        </div>

        <div className="admin-search-wrapper">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {/* CARDS */}
      <div className="admin-cards">
        <div className="admin-card">
          <p className="admin-card-label">Total usuarios</p>
          <p className="admin-card-number">{totalUsuarios}</p>
        </div>
        <div className="admin-card admin-card-green">
          <p className="admin-card-label">Activos</p>
          <p className="admin-card-number">{activos}</p>
        </div>
        <div className="admin-card admin-card-yellow">
          <p className="admin-card-label">Pendientes de pago</p>
          <p className="admin-card-number">{pendientes}</p>
        </div>
      </div>

      {/* TABLA */}
      <div className="admin-table">
        <h3>Usuarios registrados</h3>

        {cargando && <p>Cargando usuarios...</p>}
        {error && !cargando && <p className="admin-error">Error: {error}</p>}

        {!cargando && !error && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Plan actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => {
                  const estadoInicial = u.estado || "PendientePago";
                  const planInicial = u.membresia_id_actual || "";

                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        {u.nombre} {u.apellido}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.telefono}</td>
                      <td>{u.rol}</td>

                      <td>
                        <select
                          defaultValue={estadoInicial}
                          id={`estado-${u.id}`}
                          className="admin-select"
                        >
                          <option value="Activo">Activo</option>
                          <option value="PendientePago">PendientePago</option>
                          <option value="Suspendido">Suspendido</option>
                        </select>
                      </td>

                      <td>
                        {u.rol === "Cliente" ? (
                          <select
                            defaultValue={planInicial}
                            id={`plan-${u.id}`}
                            className="admin-select"
                          >
                            <option value="">Sin plan</option>
                           {planes.map((p) => {
  
                          const planId = p.id_plan ?? p.id;
                           const planNombre = p.nombre_plan ?? p.nombre;

                           return (
                           <option key={planId} value={planId}>
                            {planNombre}
                            </option>
                           );
                            })}

                          </select>
                        ) : (
                          <span className="admin-badge admin-badge-muted">
                            N/A
                          </span>
                        )}
                      </td>

                      <td>
                        <button
                          className="admin-btn-small"
                          disabled={savingId === u.id}
                          onClick={() => {
                            const nuevoEstado = document.getElementById(
                              `estado-${u.id}`
                            ).value;
                            const nuevoPlanId =
                              u.rol === "Cliente"
                                ? document.getElementById(`plan-${u.id}`).value
                                : null;

                            handleActualizar(u.id, nuevoEstado, nuevoPlanId);
                          }}
                        >
                          {savingId === u.id ? "Guardando..." : "Actualizar"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
