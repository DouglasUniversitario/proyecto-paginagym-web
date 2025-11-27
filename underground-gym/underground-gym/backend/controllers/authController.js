import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "../db.js";
import dotenv from "dotenv";
import sql from "mssql";

dotenv.config();

// 🔐 LOGIN

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await getConnection();

    // 👇 Traemos columnas explícitas, incluyendo membresia_id_actual
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(`
        SELECT 
          id,
          nombre,
          apellido,
          email,
          password,
          telefono,
          fecha_nacimiento,
          genero,
          peso,
          estatura,
          estado,
          rol,
          foto_url,
          membresia_id_actual     -- 👈 NUEVO
        FROM Usuarios
        WHERE email = @email
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    //  Verificar estado del usuario antes de dejarlo entrar
    if (user.estado !== "Activo") {
      return res.status(403).json({
        mensaje:
          "Tu cuenta está pendiente de activación. Por favor, completa el pago en el gimnasio.",
        estado: user.estado,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Enviar TODOS los datos del usuario, incluido el plan activo
    res.json({
      mensaje: "✅ Login exitoso",
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido || "",
        email: user.email,
        telefono: user.telefono,
        fecha_nacimiento: user.fecha_nacimiento,
        genero: user.genero,
        peso: user.peso,
        estatura: user.estatura,
        estado: user.estado,
        rol: user.rol,
        membresia_id_actual: user.membresia_id_actual, // plan activo
        foto_url:
          user.foto_url ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};


// REGISTRO

export const register = async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    password,
    telefono,
    fecha_nacimiento,
    genero,
    peso,
    estatura,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .input("apellido", sql.NVarChar, apellido)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("telefono", sql.NVarChar, telefono)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento || null)
      .input("genero", sql.NVarChar, genero)
      .input("peso", sql.Decimal(5, 2), peso || null)
      .input("estatura", sql.Decimal(5, 2), estatura || null)
      .query(`
        INSERT INTO Usuarios (
          nombre,
          apellido,
          email,
          password,
          telefono,
          fecha_nacimiento,
          genero,
          peso,
          estatura,
          estado,
          membresia_id_actual     
        )
        VALUES (
          @nombre,
          @apellido,
          @email,
          @password,
          @telefono,
          @fecha_nacimiento,
          @genero,
          @peso,
          @estatura,
          'PendientePago',
          NULL                    
        )
      `);

    res.json({
      mensaje:
        "✅ Usuario registrado correctamente. Pendiente de activación por pago.",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ mensaje: "❌ Error al registrar usuario" });
  }
};
