import { Router } from "express";
import {
  getPlanesAdmin,
  updatePlanAdmin,
  getClientesConPlanesAdmin,
} from "../controllers/adminPlanes.controller.js";

const router = Router();

// GET: lista de planes
router.get("/admin/planes", getPlanesAdmin);

// PUT: actualizar un plan por id
router.put("/admin/planes/:id", updatePlanAdmin);

// GET: clientes con planes
router.get("/admin/clientes-planes", getClientesConPlanesAdmin);

export default router;
