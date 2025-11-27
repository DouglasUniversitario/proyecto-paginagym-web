import React, { useState } from "react";
import "./styles/CalculadoraIMC.css";

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");

  const calcularIMC = (e) => {
    e.preventDefault();

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (!pesoNum || !alturaNum || alturaNum <= 0) {
      setImc(null);
      setCategoria("");
      setMensaje("Ingresa un peso y una altura válidos.");
      return;
    }

    const valorIMC = pesoNum / (alturaNum * alturaNum);
    const imcRedondeado = Number(valorIMC.toFixed(2));
    setImc(imcRedondeado);

    let cat = "";
    let msg = "";

    if (imcRedondeado < 18.5) {
      cat = "Bajo peso";
      msg = "Estás por debajo de tu peso ideal. Revisa tu alimentación.";
    } else if (imcRedondeado < 25) {
      cat = "Peso normal";
      msg = "¡Buen trabajo! Mantén tus hábitos actuales.";
    } else if (imcRedondeado < 30) {
      cat = "Sobrepeso";
      msg = "Sería bueno combinar entrenamiento y ajustes en la dieta.";
    } else {
      cat = "Obesidad";
      msg = "Te recomendamos un plan estructurado de entrenamiento y nutrición.";
    }

    setCategoria(cat);
    setMensaje(msg);
  };

  return (
    <div className="imc-page">
      <div className="imc-card">
        <div className="imc-header">
          <h1>Calculadora de IMC</h1>
          <p>
            Calcula tu Índice de Masa Corporal y obtén una referencia rápida
            sobre tu estado actual.
          </p>
        </div>

        <form className="imc-form" onSubmit={calcularIMC}>
          <div className="imc-grid">
            <div className="imc-field">
              <label>Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                placeholder="Ej. 72.5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
            </div>

            <div className="imc-field">
              <label>Altura (m)</label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                placeholder="Ej. 1.70"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="imc-btn">
            Calcular
          </button>
        </form>

        {/* Resultado */}
        <div className="imc-result">
          {imc !== null ? (
            <>
              <div className="imc-result-main">
                <span className="imc-label">Tu IMC</span>
                <span className="imc-value">{imc}</span>
              </div>
              <div className="imc-result-extra">
                <span className="imc-chip">{categoria}</span>
                <p>{mensaje}</p>
                <small>
                  * El IMC es solo una referencia. Para una evaluación más
                  precisa se deben considerar otros factores (masa muscular,
                  porcentaje de grasa, etc.).
                </small>
              </div>
            </>
          ) : (
            <p className="imc-placeholder">
              Ingresa tu peso y altura para ver tu resultado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
