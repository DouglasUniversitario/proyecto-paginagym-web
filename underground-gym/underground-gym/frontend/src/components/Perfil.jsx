import React, { useState } from "react";
import "./styles/Perfil.css";

export default function Perfil({ userData, onLogout, onUpdatePhoto }) {
  const [foto, setFoto] = useState(userData.foto_url || "/default-profile.png");

  const handleChangePhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newPhotoURL = URL.createObjectURL(file);
    setFoto(newPhotoURL);

    // Actualizar backend
    await fetch("http://localhost:5000/api/auth/update-photo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.email,
        foto_url: newPhotoURL,
      }),
    });

    // Avisar al componente padre (App.jsx)
    if (onUpdatePhoto) {
      onUpdatePhoto(newPhotoURL);
    }
  };

  return (
    <div className="perfil-bg">
      <div className="perfil-card">
        <h2>👤 Mi Perfil</h2>

        <div className="foto-container">
          <img
            src={foto}
            alt="Foto de perfil"
            className="foto-perfil"
          />
          <label className="subir-foto">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleChangePhoto} />
          </label>
        </div>

        <div className="perfil-info">
          <p><strong>Nombre:</strong> {userData.nombre} {userData.apellido}</p>
          <p><strong>Correo:</strong> {userData.email}</p>
          <p><strong>Teléfono:</strong> {userData.telefono}</p>
          <p><strong>Género:</strong> {userData.genero}</p>
          <p><strong>Peso:</strong> {userData.peso} kg</p>
          <p><strong>Estatura:</strong> {userData.estatura} cm</p>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          🔒 Cerrar sesión
        </button>
      </div>
    </div>
  );
}
