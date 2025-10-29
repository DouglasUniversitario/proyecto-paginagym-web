import React from "react";

export default function Contacto() {
  return (
    <section>
      <h2>Contacto</h2>
      <p>Estamos para ayudarte. Escríbenos.</p>
      <form className="grid">
        <input type="text" placeholder="Tu nombre" className="card-content" />
        <input type="email" placeholder="Tu correo" className="card-content" />
        <textarea placeholder="Tu mensaje" rows="4" className="card-content"></textarea>
        <button className="btn btn-primary">Enviar</button>
      </form>
    </section>
  );
}
