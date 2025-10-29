// =========================
//  Underground Gym Backend
// =========================

import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Puerto del servidor
const PORT = process.env.PORT || 4000;

// =========================
//   Rutas de ejemplo
// =========================

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🔥 Bienvenido al Backend de Underground Gym!");
});

// Rutas de planes
app.get("/api/planes", (req, res) => {
  const planes = [
    { id: 1, nombre: "Plan Básico", precio: 9.99, descripcion: "Entrenamientos Full Body 3x semana" },
    { id: 2, nombre: "Plan Intermedio", precio: 19.99, descripcion: "Rutina Torso/Pierna + Plan nutricional" },
    { id: 3, nombre: "Plan PRO", precio: 29.99, descripcion: "HIIT + Suplementos + Entrenador personal" },
  ];
  res.json(planes);
});

// Rutas de suplementos
app.get("/api/suplementos", (req, res) => {
  const suplementos = [
    { id: 1, nombre: "Proteína Whey 2lb", precio: 29.99 },
    { id: 2, nombre: "Creatina Monohidratada", precio: 19.99 },
    { id: 3, nombre: "Pre-entreno CAF+", precio: 24.99 },
  ];
  res.json(suplementos);
});

// Ruta de pago (simulada)
app.post("/api/pago", (req, res) => {
  const { nombre, correo, plan, monto } = req.body;
  console.log(`💳 Pago recibido de ${nombre} (${correo}) - Plan: ${plan} - $${monto}`);
  res.json({ mensaje: "✅ Pago procesado correctamente." });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
