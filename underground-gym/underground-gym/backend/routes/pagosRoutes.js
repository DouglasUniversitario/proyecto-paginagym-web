import express from "express";

const router = express.Router();

const procesarPago = (req, res) => {
  console.log("💳 Petición de pago:", req.method, req.originalUrl);
  console.log("Body recibido:", req.body);

  // 1) Validar que de verdad venga body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      ok: false,
      message:
        "No se recibieron datos en el body. Verifica que envías JSON y Content-Type: application/json",
    });
  }

  // 2) Ya es seguro destructurar
  const { email, numeroTarjeta, fechaExpiracion, cvv, total } = req.body;

  if (!email || !numeroTarjeta || !fechaExpiracion || !cvv) {
    return res.status(400).json({
      ok: false,
      message: "Faltan datos del pago",
    });
  }

  return res.status(200).json({
    ok: true,
    message: "Pago procesado correctamente ✅",
    cobrado: total || 0,
  });
};

// Para probar rápido con GET
router.get("/", (req, res) => {
  res.json({ ok: true, message: "Endpoint de pagos funcionando ✅" });
});

router.post("/", procesarPago);
router.post("/confirmar", procesarPago);

export default router;
