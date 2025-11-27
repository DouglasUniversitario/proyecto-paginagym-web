import { getConnection } from "../db.js";
import sql from "mssql";


// USUARIOS


export const getUsuarios = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        id,
        nombre,
        apellido,
        email,
        telefono,
        fecha_nacimiento,
        genero,
        peso,
        estatura,
        foto_url,
        estado,
        rol,
        membresia_id_actual
      FROM Usuarios
    `);

    res.json({
      ok: true,
      usuarios: result.recordset,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al cargar usuarios" });
  }
};

// Actualizar estado y plan de un usuario
export const updateUsuarioEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, membresia_id_actual } = req.body;

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .input("estado", sql.NVarChar(50), estado)
      .input(
        "membresia_id_actual",
        sql.Int,
        membresia_id_actual ? parseInt(membresia_id_actual) : null
      )
      .query(`
        UPDATE Usuarios
        SET 
          estado = @estado,
          membresia_id_actual = @membresia_id_actual
        WHERE id = @id;

        SELECT 
          id,
          nombre,
          apellido,
          email,
          telefono,
          estado,
          rol,
          membresia_id_actual
        FROM Usuarios
        WHERE id = @id;
      `);

    const usuario = result.recordset[0];

    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    res.json({ ok: true, usuario });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ ok: false, mensaje: "Error al actualizar usuario" });
  }
};



// ENTRENADORES (CRUD Admin)


export const getEntrenadores = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        id,
        nombre,
        especialidad,
        horario,
        telefono,
        email,
        estado
      FROM Entrenadores
      ORDER BY id;
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener entrenadores:", error);
    res.status(500).json({ error: "Error al cargar entrenadores" });
  }
};

export const createEntrenador = async (req, res) => {
  try {
    const { nombre, especialidad, horario, telefono, email, estado } = req.body;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("especialidad", sql.NVarChar(200), especialidad || null)
      .input("horario", sql.NVarChar(200), horario || null)
      .input("telefono", sql.NVarChar(20), telefono || null)
      .input("email", sql.NVarChar(150), email || null)
      .input("estado", sql.NVarChar(20), estado || "Activo")
      .query(`
        INSERT INTO Entrenadores (nombre, especialidad, horario, telefono, email, estado)
        OUTPUT INSERTED.*
        VALUES (@nombre, @especialidad, @horario, @telefono, @email, @estado);
      `);

    const entrenador = result.recordset[0];
    res.status(201).json({ ok: true, entrenador });
  } catch (error) {
    console.error("Error al crear entrenador:", error);
    res.status(500).json({ error: "Error al crear entrenador" });
  }
};

export const updateEntrenador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, horario, telefono, email, estado } = req.body;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .input("nombre", sql.NVarChar(100), nombre)
      .input("especialidad", sql.NVarChar(200), especialidad || null)
      .input("horario", sql.NVarChar(200), horario || null)
      .input("telefono", sql.NVarChar(20), telefono || null)
      .input("email", sql.NVarChar(150), email || null)
      .input("estado", sql.NVarChar(20), estado || "Activo")
      .query(`
        UPDATE Entrenadores
        SET
          nombre = @nombre,
          especialidad = @especialidad,
          horario = @horario,
          telefono = @telefono,
          email = @email,
          estado = @estado
        WHERE id = @id;

        SELECT * FROM Entrenadores WHERE id = @id;
      `);

    const entrenador = result.recordset[0];
    if (!entrenador) {
      return res.status(404).json({ error: "Entrenador no encontrado" });
    }

    res.json({ ok: true, entrenador });
  } catch (error) {
    console.error("Error al actualizar entrenador:", error);
    res.status(500).json({ error: "Error al actualizar entrenador" });
  }
};

export const deleteEntrenador = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query(`DELETE FROM Entrenadores WHERE id = @id;`);

    res.json({ ok: true, mensaje: "Entrenador eliminado" });
  } catch (error) {
    console.error("Error al eliminar entrenador:", error);
    res.status(500).json({ error: "Error al eliminar entrenador" });
  }
};

// RUTINAS (CRUD Admin)

// GET: lista de rutinas
export const getRutinas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        id,
        nombre,
        nivel,
        entrenador,
        diaSemana       AS diaSemana,
        horaInicio      AS horaInicio,
        horaFin         AS horaFin,
        estadoEntrenador AS estadoEntrenador
      FROM Rutinas
      ORDER BY id;
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener rutinas:", error);
    res.status(500).json({ error: "Error al cargar rutinas" });
  }
};

// POST: crear rutina
export const createRutina = async (req, res) => {
  try {
    const {
      nombre,
      nivel,
      entrenador,
      diaSemana,
      horaInicio,
      horaFin,
      estadoEntrenador,
    } = req.body;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("nivel", sql.NVarChar(50), nivel)
      .input("entrenador", sql.NVarChar(100), entrenador)
      .input("diaSemana", sql.NVarChar(100), diaSemana)
      .input("horaInicio", sql.NVarChar(5), horaInicio)
      .input("horaFin", sql.NVarChar(5), horaFin)
      .input("estadoEntrenador", sql.NVarChar(20), estadoEntrenador)
      .query(`
        INSERT INTO Rutinas
          (nombre, nivel, entrenador, diaSemana, horaInicio, horaFin, estadoEntrenador)
        OUTPUT INSERTED.*
        VALUES
          (@nombre, @nivel, @entrenador, @diaSemana, @horaInicio, @horaFin, @estadoEntrenador);
      `);

    const rutina = result.recordset[0];
    res.status(201).json({ ok: true, rutina });
  } catch (error) {
    console.error("Error al crear rutina:", error);
    res.status(500).json({ error: "Error al crear rutina" });
  }
};

// PUT: actualizar rutina
export const updateRutina = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      nivel,
      entrenador,
      diaSemana,
      horaInicio,
      horaFin,
      estadoEntrenador,
    } = req.body;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .input("nombre", sql.NVarChar(100), nombre)
      .input("nivel", sql.NVarChar(50), nivel)
      .input("entrenador", sql.NVarChar(100), entrenador)
      .input("diaSemana", sql.NVarChar(100), diaSemana)
      .input("horaInicio", sql.NVarChar(5), horaInicio)
      .input("horaFin", sql.NVarChar(5), horaFin)
      .input("estadoEntrenador", sql.NVarChar(20), estadoEntrenador)
      .query(`
        UPDATE Rutinas
        SET
          nombre = @nombre,
          nivel = @nivel,
          entrenador = @entrenador,
          diaSemana = @diaSemana,
          horaInicio = @horaInicio,
          horaFin = @horaFin,
          estadoEntrenador = @estadoEntrenador
        WHERE id = @id;

        SELECT
          id,
          nombre,
          nivel,
          entrenador,
          diaSemana       AS diaSemana,
          horaInicio      AS horaInicio,
          horaFin         AS horaFin,
          estadoEntrenador AS estadoEntrenador
        FROM Rutinas
        WHERE id = @id;
      `);

    const rutina = result.recordset[0];
    if (!rutina) {
      return res.status(404).json({ error: "Rutina no encontrada" });
    }

    res.json({ ok: true, rutina });
  } catch (error) {
    console.error("Error al actualizar rutina:", error);
    res.status(500).json({ error: "Error al actualizar rutina" });
  }
};

// DELETE: eliminar rutina
export const deleteRutina = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query(`
        DELETE FROM Rutinas
        WHERE id = @id;
      `);

    res.json({ ok: true, mensaje: "Rutina eliminada" });
  } catch (error) {
    console.error("Error al eliminar rutina:", error);
    res.status(500).json({ error: "Error al eliminar rutina" });
  }
};



//  PLANES (Admin)


// GET: lista de planes
export const getPlanes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        id_plan        AS id,          -- 👈 mapeamos a "id"
        nombre_plan    AS nombre,      -- 👈 mapeamos a "nombre"
        descripcion    AS descripcion,
        precio_mensual AS precio       -- 👈 mapeamos a "precio"
      FROM Planes
      ORDER BY id_plan;
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).json({ error: "Error al cargar planes" });
  }
};

// PUT: actualizar un plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;             
    const { nombre, descripcion, precio } = req.body;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .input("nombre", sql.NVarChar(100), nombre)
      .input("descripcion", sql.NVarChar(300), descripcion || null)
      .input("precio", sql.Decimal(10, 2), precio)
      .query(`
        UPDATE Planes
        SET
          nombre_plan    = @nombre,
          descripcion    = @descripcion,
          precio_mensual = @precio
        WHERE id_plan = @id;

        SELECT 
          id_plan        AS id,
          nombre_plan    AS nombre,
          descripcion    AS descripcion,
          precio_mensual AS precio
        FROM Planes
        WHERE id_plan = @id;
      `);

    const plan = result.recordset[0];

    if (!plan) {
      return res.status(404).json({ ok: false, error: "Plan no encontrado" });
    }

    res.json({ ok: true, plan });
  } catch (error) {
    console.error("Error al actualizar plan:", error);
    res.status(500).json({ error: "Error al actualizar plan" });
  }
};

// GET: clientes con plan asignado
export const getClientesPlanes = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        u.id AS idCliente,
        u.nombre + ' ' + ISNULL(u.apellido, '') AS nombreCompleto,
        u.email,
        u.estado,
        u.membresia_id_actual,
        p.nombre_plan    AS nombrePlan,
        p.precio_mensual AS precioPlan,
        NULL AS fechaFin   -- placeholder por ahora
      FROM Usuarios u
      JOIN Planes p 
        ON u.membresia_id_actual = p.id_plan
      WHERE u.rol = 'Cliente';
    `);

    // AdminPlanes.jsx espera un array normal
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener clientes y planes:", error);
    res.status(500).json({ error: "Error al cargar clientes y planes" });
  }
};



// SUPLEMENTOS (CRUD simple en memoria)


// Arreglo en memoria mientras tanto
let suplementos = [];

// GET: listar suplementos
export const getSuplementos = (req, res) => {
  try {
    return res.json({
      ok: true,
      suplementos,
    });
  } catch (error) {
    console.error("Error al obtener suplementos:", error);
    return res.status(500).json({ ok: false, error: "Error al cargar suplementos" });
  }
};

// POST: crear suplemento
export const createSuplemento = (req, res) => {
  try {
    // Tomamos todo lo que viene del formulario
    const data = req.body;

    // Generamos ID simple en memoria
    const nuevoId =
      suplementos.length > 0
        ? suplementos[suplementos.length - 1].id + 1
        : 1;

    const nuevo = {
      id: nuevoId,
      ...data, // nombre, descripcion, precio, stock, imagenUrl, visible, etc.
    };

    suplementos.push(nuevo);

    return res.status(201).json({
      ok: true,
      suplemento: nuevo,
    });
  } catch (error) {
    console.error("Error al crear suplemento:", error);
    return res.status(500).json({ ok: false, error: "Error al crear suplemento" });
  }
};

// PUT: actualizar suplemento
export const updateSuplemento = (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const idx = suplementos.findIndex((s) => s.id === Number(id));
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: "Suplemento no encontrado" });
    }

    suplementos[idx] = {
      ...suplementos[idx],
      ...data,
    };

    return res.json({
      ok: true,
      suplemento: suplementos[idx],
    });
  } catch (error) {
    console.error("Error al actualizar suplemento:", error);
    return res.status(500).json({ ok: false, error: "Error al actualizar suplemento" });
  }
};

// DELETE: eliminar suplemento
export const deleteSuplemento = (req, res) => {
  try {
    const { id } = req.params;

    const existe = suplementos.some((s) => s.id === Number(id));
    if (!existe) {
      return res.status(404).json({ ok: false, error: "Suplemento no encontrado" });
    }

    suplementos = suplementos.filter((s) => s.id !== Number(id));

    return res.json({
      ok: true,
      mensaje: "Suplemento eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar suplemento:", error);
    return res.status(500).json({ ok: false, error: "Error al eliminar suplemento" });
  }
};

 // VENTAS DE SUPLEMENTOS
 

// GET: listar ventas registradas
export const getVentasSuplementos = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        id_venta        AS id,
        fecha_venta     AS fecha,
        nombre_cliente  AS cliente,
        nombre_producto AS producto,
        cantidad_total  AS cantidad,
        metodo_pago,
        total,
        estado_entrega
      FROM dbo.VentasSuplementos
      ORDER BY fecha_venta DESC;
    `);

    return res.json({
      ok: true,
      ventas: result.recordset,
    });
  } catch (error) {
    console.error("Error al obtener ventas de suplementos:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al cargar ventas de suplementos",
    });
  }
};

// POST: registrar una nueva venta desde el pago del carrito
export const registrarVentaSuplementos = async (req, res) => {
  try {
    const { items, subtotal, costoEnvio, total, datosCliente } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        ok: false,
        mensaje: "No hay productos en la venta.",
      });
    }

    const primerItem = items[0];
    const cantidadTotal = items.reduce(
      (acc, it) => acc + Number(it.qty || it.cantidad || 0),
      0
    );

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("nombre_cliente", sql.NVarChar(150), datosCliente?.nombre || "")
      .input(
        "telefono_cliente",
        sql.NVarChar(20),
        datosCliente?.telefono || null
      )
      .input("dui_cliente", sql.NVarChar(20), datosCliente?.dui || null)
      .input(
        "tipo_entrega",
        sql.NVarChar(20),
        datosCliente?.tipoEntrega || "Envio"
      )
      .input(
        "departamento",
        sql.NVarChar(100),
        datosCliente?.departamento || null
      )
      .input(
        "municipio",
        sql.NVarChar(100),
        datosCliente?.municipio || null
      )
      .input("direccion", sql.NVarChar(300), datosCliente?.direccion || null)
      .input(
        "nombre_producto",
        sql.NVarChar(200),
        primerItem.name || "Varios suplementos"
      )
      .input("cantidad_total", sql.Int, cantidadTotal || 1)
      .input("subtotal", sql.Decimal(10, 2), subtotal)
      .input("costo_envio", sql.Decimal(10, 2), costoEnvio)
      .input("total", sql.Decimal(10, 2), total)
      .input("metodo_pago", sql.NVarChar(50), "Tarjeta")
      .query(`
        INSERT INTO dbo.VentasSuplementos
        (
          nombre_cliente, telefono_cliente, dui_cliente,
          tipo_entrega, departamento, municipio, direccion,
          nombre_producto, cantidad_total,
          subtotal, costo_envio, total, metodo_pago, fecha_venta, estado_entrega
        )
        OUTPUT INSERTED.id_venta AS id_venta
        VALUES
        (
          @nombre_cliente, @telefono_cliente, @dui_cliente,
          @tipo_entrega, @departamento, @municipio, @direccion,
          @nombre_producto, @cantidad_total,
          @subtotal, @costo_envio, @total, @metodo_pago, GETDATE(), 'Pendiente'
        );
      `);

    const id_venta = result.recordset[0]?.id_venta;

    return res.status(201).json({
      ok: true,
      mensaje: "Venta registrada correctamente.",
      id_venta,
    });
  } catch (error) {
    console.error("Error al registrar venta de suplementos:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error interno al registrar la venta.",
    });
  }
};

// PUT: marcar venta como entregada
export const marcarVentaEntregada = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("▶️ marcarVentaEntregada ID:", id);

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query(`
        UPDATE dbo.VentasSuplementos
        SET estado_entrega = 'Entregado'
        WHERE id_venta = @id;

        SELECT
          id_venta        AS id,
          fecha_venta     AS fecha,
          nombre_cliente  AS cliente,
          nombre_producto AS producto,
          cantidad_total  AS cantidad,
          metodo_pago,
          total,
          estado_entrega
        FROM dbo.VentasSuplementos
        WHERE id_venta = @id;
      `);

    const venta = result.recordset[0];

    if (!venta) {
      return res.status(404).json({
        ok: false,
        mensaje: "Venta no encontrada",
      });
    }

    return res.json({
      ok: true,
      venta,
    });
  } catch (error) {
    console.error("Error al marcar venta como entregada:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el estado de entrega",
    });
  }
};



//  MENSAJES DE CONTACTO

export const getMensajesContacto = async (req, res) => {
  try {
    const pool = await getConnection();

    let mensajes = [];

    try {
      //  Ajusta nombres de columnas 
      const result = await pool.request().query(`
        SELECT 
          id,
          nombre,
          email,
          asunto,
          mensaje,
          fecha_envio,
          estado
        FROM MensajesContacto
        ORDER BY fecha_envio DESC
      `);

      mensajes = result.recordset;
    } catch (dbErr) {
      // Si la tabla no existe o las columnas no coinciden,
      // NO rompemos el panel, solo devolvemos lista vacía
      console.error("⚠️ No se pudo leer MensajesContacto, devolviendo lista vacía:", dbErr);
      mensajes = [];
    }

    //  Siempre devolvemos ok: true, aunque la lista esté vacía
    res.json({
      ok: true,
      mensajes,
    });
  } catch (error) {
    console.error("Error general al obtener mensajes de contacto:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al cargar mensajes",
    });
  }
};
