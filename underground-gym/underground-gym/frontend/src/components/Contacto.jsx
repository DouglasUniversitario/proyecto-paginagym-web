import React, { useState } from "react";
import "./styles/Contacto.css";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setEnviando(true);

      const resp = await fetch("http://localhost:5000/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        throw new Error(data.mensaje || "No se pudo enviar tu mensaje.");
      }

      alert(
        "Tu mensaje se envio correctamente. Un administrador lo revisara pronto."
      );

      // Limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Ocurrio un error al enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="contact-page">
      {/* HERO SUPERIOR */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <p className="contact-hero-badge">Hablemos</p>
          <h1>
            Ponte en contacto <span>con nosotros</span>
          </h1>
          <p>
            Para nosotros es un placer atenderte. Completa el formulario y te
            responderemos lo antes posible.
          </p>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className="contact-content">
        {/* Columna info */}
        <div className="contact-info">
          <h2>Información del gym</h2>
          <p className="contact-info-text">
            Si tienes dudas sobre membresías, rutinas, pagos o suplementos, usa
            este formulario o nuestros medios de contacto directo.
          </p>

          <div className="contact-info-grid">
            <div className="contact-info-card">
              <span className="contact-info-icon">📍</span>
              <h3>Ubicación</h3>
              <p>
                UNDERGROUND_gym <br />
                San Salvador, El Salvador.
              </p>
            </div>

            <div className="contact-info-card">
              <span className="contact-info-icon">⏰</span>
              <h3>Horarios</h3>
              <p>
                Lun - Vie: 5:00 a.m. - 10:00 p.m.
                <br />
                Sáb: 6:00 a.m. - 4:00 p.m.
              </p>
            </div>

            <div className="contact-info-card">
              <span className="contact-info-icon">📞</span>
              <h3>Contacto directo</h3>
              <p>
                Tel: +503 1234-5678
                <br />
                Email: info@undergroundgym.com
              </p>
            </div>
          </div>
        </div>

        {/* Columna formulario */}
        <div className="contact-form-wrapper">
          <h2>Envíanos un mensaje</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="asunto">Asunto</label>
              <input
                id="asunto"
                name="asunto"
                type="text"
                placeholder="Consulta sobre membresías, rutinas, etc."
                value={formData.asunto}
                onChange={handleChange}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                placeholder="Cuéntanos en qué podemos ayudarte..."
                value={formData.mensaje}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-submit-btn" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
