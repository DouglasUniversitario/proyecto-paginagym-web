import React, { useEffect, useState } from "react";
import "./styles/AdminPanel.css"; // reutilizamos estilos del panel

export default function AdminVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [soloPendientes, setSoloPendientes] = useState(true);


  //  Cargar ventas

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const resp = await fetch(
          "http://localhost:5000/api/admin/ventas-suplementos"
        );
        const data = await resp.json();

        if (resp.ok) {
          setVentas(data.ventas || []);
        } else {
          setError(data.mensaje || "Error al cargar ventas");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
      } finally {
        setCargando(false);
      }
    };

    fetchVentas();
  }, []);

  //  Marcar venta como entregada
 
  const marcarEntregado = async (idVenta) => {
    const confirmar = window.confirm(
      "¿Confirmas que este pedido ya fue entregado?"
    );
    if (!confirmar) return;

    try {
      const resp = await fetch(
        `http://localhost:5000/api/admin/ventas-suplementos/${idVenta}/entrega`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado_entrega: "Entregado" }),
        }
      );

      const data = await resp.json();
      console.log("Respuesta marcar entregado:", resp.status, data);

      if (!resp.ok || data.ok === false) {
        alert(data.mensaje || "No se pudo actualizar el estado");
        return;
      }

      // Actualizar solo esa venta en el estado
      setVentas((prev) =>
        prev.map((v) =>
          (v.id ?? v.id_venta) === idVenta
            ? { ...v, estado_entrega: "Entregado" }
            : v
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  //  Totales (de TODAS las ventas)

  const totalVentas = ventas.length;
  const ingresosTotales = ventas
    .reduce((acc, v) => acc + Number(v.total || 0), 0)
    .toFixed(2);


  //  Filtro visual (solo pendientes / todas)

  const ventasFiltradas = soloPendientes
    ? ventas.filter((v) => {
        const estado = (v.estado_entrega || "Pendiente").toLowerCase();
        return estado !== "entregado";
      })
    : ventas;

  return (
    <div className="admin-bg">
      <div className="admin-header">
        <div>
          <h2>Ventas de suplementos</h2>
          <p className="admin-subtitle">
            Resumen de compras realizadas en la tienda de Underground Gym
          </p>
        </div>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>Total de ventas</h3>
          <p className="admin-card-number">{totalVentas}</p>
        </div>
        <div className="admin-card admin-card-green">
          <h3>Ingresos totales</h3>
          <p className="admin-card-number">${ingresosTotales}</p>
        </div>
      </div>

      <div className="admin-table">
        {/* Encabezado + switch de filtro */}
        <div className="admin-table-header">
          <h3>Detalle de ventas</h3>

          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={soloPendientes}
              onChange={() => setSoloPendientes((prev) => !prev)}
            />
            <span>
              {soloPendientes
                ? "Mostrando solo pendientes"
                : "Mostrando todas"}
            </span>
          </label>
        </div>

        {cargando && <p>Cargando ventas...</p>}
        {error && <p className="admin-error">{error}</p>}

        {!cargando && !error && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Método de pago</th>
                <th>Total ($)</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((v) => {
                // Soportar ambos nombres de columnas para no perder datos
                const id = v.id ?? v.id_venta;
                const fecha = v.fecha ?? v.fecha_venta;
                const cliente = v.cliente ?? v.nombre_cliente;
                const producto = v.producto ?? v.nombre_producto;
                const cantidad = v.cantidad ?? v.cantidad_total;
                const metodoPago = v.metodo_pago ?? v.metodoPago;
                const total = v.total ?? 0;
                const estado = v.estado_entrega || "Pendiente";
                const entregado = estado === "Entregado";

                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{fecha}</td>
                    <td>{cliente}</td>
                    <td>{producto}</td>
                    <td>{cantidad}</td>
                    <td>{metodoPago}</td>
                    <td>{Number(total).toFixed(2)}</td>

                    {/* Estado */}
                    <td>
                      <span
                        className={
                          "admin-pill " +
                          (entregado
                            ? "admin-pill--ok"
                            : "admin-pill--pending")
                        }
                      >
                        {entregado ? "ENTREGADO" : "PENDIENTE"}
                      </span>
                    </td>

                    {/* Botón */}
                    <td>
                      <button
                        className={
                          "admin-btn-entrega" +
                          (entregado ? " admin-btn-entrega--disabled" : "")
                        }
                        onClick={() => marcarEntregado(id)}
                        disabled={entregado}
                      >
                        {entregado ? "Entregado" : "Marcar entregado"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {ventasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No hay ventas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
