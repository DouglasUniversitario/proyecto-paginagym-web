import sql from "mssql";
import { getConnection } from "../db.js";

//  POST /api/contacto/contacto
//  (formulario publico)

export const crearMensajeContacto = async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre, email y mensaje son obligatorios.",
      });
    }

    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.NVarChar(150), nombre)
      .input("email", sql.NVarChar(150), email)
      .input("asunto", sql.NVarChar(200), asunto || null)
      .input("mensaje", sql.NVarChar(sql.MAX), mensaje)
      .query(`
        INSERT INTO MensajesContacto (nombre, email, asunto, mensaje, fecha_envio, estado)
        VALUES (@nombre, @email, @asunto, @mensaje, GETDATE(), 'Pendiente')
      `);

    return res.status(201).json({
      ok: true,
      mensaje:
        "Tu mensaje se envió correctamente. Un administrador lo revisará pronto.",
    });
  } catch (err) {
    console.error("Error al guardar mensaje de contacto:", err);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al guardar el mensaje.",
    });
  }
};


//  GET /api/admin/mensajes-contacto
//  (panel administrador)

export const getMensajesContacto = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        id_mensaje,
        nombre,
        email,
        ISNULL(asunto, '') AS asunto,
        mensaje,
        fecha_envio,
        estado
      FROM MensajesContacto
      ORDER BY fecha_envio DESC;
    `);

    return res.json({
      ok: true,
      mensajes: result.recordset,
    });
  } catch (err) {
    console.error("Error al obtener mensajes de contacto:", err);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener los mensajes.",
    });
  }
};

//  PUT /api/admin/mensajes-contacto/:id/estado
//  Cambiar estado (Pendiente -> Revisado, etc.)

export const actualizarEstadoMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nuevo estado es obligatorio.",
      });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", sql.Int, Number(id))
      .input("estado", sql.NVarChar(50), estado)
      .query(`
        UPDATE MensajesContacto
        SET estado = @estado
        WHERE id_mensaje = @id;

        SELECT
          id_mensaje,
          nombre,
          email,
          ISNULL(asunto, '') AS asunto,
          mensaje,
          fecha_envio,
          estado
        FROM MensajesContacto
        WHERE id_mensaje = @id;
      `);

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Mensaje no encontrado.",
      });
    }

    const mensajeActualizado = result.recordset[0];

    return res.json({
      ok: true,
      mensaje: "Estado del mensaje actualizado correctamente.",
      data: mensajeActualizado,
    });
  } catch (err) {
    console.error("Error al actualizar estado del mensaje:", err);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al actualizar el estado del mensaje.",
    });
  }
};
