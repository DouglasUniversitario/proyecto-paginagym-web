//  Underground Gym Backend

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactoRoutes from "./routes/contactoRoutes.js";


// Configurar variables de entorno (.env)
dotenv.config();

const app = express();

//   Middlewares globales

app.use(
  cors({
    origin: "http://localhost:5173", //  frontend de Vite 
    credentials: true,
  })
);
app.use(express.json());

// Puerto del servidor
const PORT = process.env.PORT || 5000;

//   Datos en memoria

//  Planes base (se usan para /api/planes y /api/admin/planes)
export const planes = [
  {
    id: 1,
    nombre: "Plan Básico",
    precio: 9.99,
    descripcion: "Entrenamientos Full Body 3x semana",
  },
  {
    id: 2,
    nombre: "Plan Intermedio",
    precio: 19.99,
    descripcion: "Rutina Torso/Pierna + Plan nutricional",
  },
  {
    id: 3,
    nombre: "Plan Avanzado",
    precio: 29.99,
    descripcion: "Plan completo + seguimiento mensual",
  },
];

// Endpoint publico para mostrar los planes en la web
app.get("/api/planes", (req, res) => {
  res.json(planes);
});

//  Rutas API

app.use("/api/auth", authRoutes);
app.use("/api/pagos", pagosRoutes);      
app.use("/api/admin", adminRoutes);
app.use("/api/contacto", contactoRoutes);


// Ruta de prueba para ver si el backend responde
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "API Underground Gym funcionando ✅" });
});

// 404 para rutas no encontradas (con log para depurar)
app.use((req, res) => {
  console.log("❌ 404:", req.method, req.originalUrl);
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
});

//   Levantar el servidor

app.listen(PORT, () => {
  console.log(`🚀 Servidor Underground Gym en http://localhost:${PORT}`);
});
