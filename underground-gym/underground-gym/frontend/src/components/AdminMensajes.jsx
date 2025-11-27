import React, { useEffect, useState } from "react";
import "./styles/AdminPanel.css";

export default function AdminMensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        setCargando(true);
        const resp = await fetch(
          "http://localhost:5000/api/admin/mensajes-contacto"
        );
        const data = await resp.json();

        if (!resp.ok || data.ok === false) {
          throw new Error(data.mensaje || "Error al cargar mensajes");
        }

        setMensajes(data.mensajes || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar mensajes");
      } finally {
        setCargando(false);
      }
    };

    fetchMensajes();
  }, []);

  const total = mensajes.length;
  const pendientes = mensajes.filter((m) => m.estado === "Pendiente").length;

  // Solo mostramos los pendientes en la tabla
  const mensajesPendientes = mensajes.filter(
    (m) => m.estado === "Pendiente"
  );

  const marcarRevisado = async (id_mensaje) => {
    try {
      setSavingId(id_mensaje);

      const resp = await fetch(
        `http://localhost:5000/api/admin/mensajes-contacto/${id_mensaje}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: "Revisado" }),
        }
      );

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        throw new Error(data.mensaje || "Error al actualizar estado");
      }

      // Actualizamos el estado local: el mensaje pasa a Revisado
      setMensajes((prev) =>
        prev.map((m) =>
          m.id_mensaje === id_mensaje ? { ...m, estado: "Revisado" } : m
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al marcar como revisado");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-bg">
      <div className="admin-header">
        <div>
          <h2>Comentarios de contacto</h2>
          <p className="admin-subtitle">
            Resumen de mensajes enviados desde el formulario de contacto.
          </p>
        </div>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <p className="admin-card-label">Total</p>
          <p className="admin-card-number">{total}</p>
        </div>
        <div className="admin-card admin-card-yellow">
          <p className="admin-card-label">Pendientes de revisar</p>
          <p className="admin-card-number">{pendientes}</p>
        </div>
      </div>

      <div className="admin-table">
        <h3>Detalle de mensajes</h3>

        {cargando && <p>Cargando mensajes...</p>}
        {error && !cargando && (
          <p className="admin-error">Error: {error}</p>
        )}

        {!cargando && !error && (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mensajesPendientes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No hay mensajes de contacto pendientes.
                  </td>
                </tr>
              ) : (
                mensajesPendientes.map((m) => (
                  <tr key={m.id_mensaje}>
                    <td>{m.nombre}</td>
                    <td>{m.email}</td>
                    <td>{m.asunto || "—"}</td>
                    <td>{m.mensaje}</td>
                    <td>
                      {new Date(m.fecha_envio).toLocaleString("es-SV", {
                        hour12: true,
                      })}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-yellow">
                        {m.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-btn-small"
                        disabled={savingId === m.id_mensaje}
                        onClick={() => marcarRevisado(m.id_mensaje)}
                      >
                        {savingId === m.id_mensaje
                          ? "Guardando..."
                          : "Marcar revisado"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
