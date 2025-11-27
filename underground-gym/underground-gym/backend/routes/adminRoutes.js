
import { Router } from "express";

import {
  getUsuarios,

  // Entrenadores
  getEntrenadores,
  createEntrenador,
  updateEntrenador,
  deleteEntrenador,

  // Rutinas
  getRutinas,
  createRutina,
  updateRutina,
  deleteRutina,

  // Planes
  getPlanes,
  updatePlan,
  getClientesPlanes,

  // Ventas suplementos
  getVentasSuplementos,
  registrarVentaSuplementos,   
  marcarVentaEntregada,

  // Suplementos
  getSuplementos,
  createSuplemento,
  updateSuplemento,
  deleteSuplemento,

  // Usuario/plan
  updateUsuarioEstado,
} from "../controllers/adminController.js";

// Mensajes de contacto (vienen de contactoController)
import { getMensajesContacto } from "../controllers/contactoController.js";

const router = Router();


//    Usuarios

router.get("/usuarios", getUsuarios);
router.put("/usuarios/:id/estado", updateUsuarioEstado);


//    Entrenadores

router.get("/entrenadores", getEntrenadores);
router.post("/entrenadores", createEntrenador);
router.put("/entrenadores/:id", updateEntrenador);
router.delete("/entrenadores/:id", deleteEntrenador);


//    Rutinas

router.get("/rutinas", getRutinas);
router.post("/rutinas", createRutina);
router.put("/rutinas/:id", updateRutina);
router.delete("/rutinas/:id", deleteRutina);

//    Clientes + Planes

router.get("/clientes-planes", getClientesPlanes);


//    Planes

router.get("/planes", getPlanes);
router.put("/planes/:id", updatePlan);


//    Ventas de suplementos

router.get("/ventas-suplementos", getVentasSuplementos);
router.post("/ventas-suplementos", registrarVentaSuplementos);
router.put("/ventas-suplementos/:id/entrega", marcarVentaEntregada);


//    Mensajes de contacto

router.get("/mensajes-contacto", getMensajesContacto);


//    Suplementos

router.get("/suplementos", getSuplementos);
router.post("/suplementos", createSuplemento);
router.put("/suplementos/:id", updateSuplemento);
router.delete("/suplementos/:id", deleteSuplemento);

export default router;
