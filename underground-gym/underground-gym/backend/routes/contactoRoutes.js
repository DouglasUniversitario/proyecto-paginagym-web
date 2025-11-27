import { Router } from "express";
import { crearMensajeContacto } from "../controllers/contactoController.js";

const router = Router();

// POST /api/contacto
router.post("/", crearMensajeContacto);

export default router;
