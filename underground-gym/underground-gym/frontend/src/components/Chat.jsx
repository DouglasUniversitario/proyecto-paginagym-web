
import React from "react";
import "./styles/Chat.css";

export default function Chat() {
 
  const telefono = "+503 7094 4972";

  const mensaje = encodeURIComponent(
    "Hola, vengo desde la web Underground Gym y tengo una consulta sobre mi plan."
  );

  const urlWhatsApp = `https://wa.me/${telefono}?text=${mensaje}`;

  return (
    <div className="chat-page">
      <div className="chat-card">
        <h2>Chat con Underground Gym</h2>
        <p>
          Si tienes dudas sobre tu rutina, plan de alimentación o suplementos,
          puedes escribirnos directamente por WhatsApp.
        </p>

        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="chat-whatsapp-btn"
        >
          Abrir chat de WhatsApp
        </a>

        <p className="chat-note">
          *Se abrirá una nueva ventana en WhatsApp Web o en la app móvil.
        </p>
      </div>
    </div>
  );
}
