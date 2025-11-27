import React, { useState } from "react";
import "./styles/Imc.css";

export default function Imc({ userData }) {
  const [peso, setPeso] = useState(userData?.peso || "");
  const [estatura, setEstatura] = useState(
    userData?.estatura ? String(userData.estatura) : ""
  ); // en cm
  const [resultado, setResultado] = useState(null);

  const calcularIMC = (e) => {
    e.preventDefault();
    const p = parseFloat(peso);
    const hCm = parseFloat(estatura);

    if (!p || !hCm) return;

    const h = hCm / 100; 
    const imc = p / (h * h);

    let categoria = "";
    if (imc < 18.5) categoria = "Bajo peso";
    else if (imc < 25) categoria = "Peso normal";
    else if (imc < 30) categoria = "Sobrepeso";
    else categoria = "Obesidad";

    setResultado({
      imc: imc.toFixed(1),
      categoria,
    });
  };

  return (
    <div className="imc-page">
      <div className="imc-card">
        <h2>Calculadora de IMC</h2>
        <p>
          Calcula tu Índice de Masa Corporal usando tu peso y estatura. Esto no
          reemplaza una valoración profesional, pero te da una idea general.
        </p>

        <form className="imc-form" onSubmit={calcularIMC}>
          <div className="imc-row">
            <label>Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </div>

          <div className="imc-row">
            <label>Estatura (cm)</label>
            <input
              type="number"
              step="0.1"
              value={estatura}
              onChange={(e) => setEstatura(e.target.value)}
            />
          </div>

          <button type="submit" className="imc-btn">
            Calcular IMC
          </button>
        </form>

        {resultado && (
          <div className="imc-result">
            <h3>Tu resultado</h3>
            <p className="imc-value">{resultado.imc}</p>
            <p className="imc-category">{resultado.categoria}</p>
          </div>
        )}
      </div>
    </div>
  );
}
