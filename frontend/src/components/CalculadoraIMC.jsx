//Codigo para calcular el ICM de la persona. 
import React, { useState } from "react";

// Define el componente funcional CalculadoraIMC
const CalculadoraIMC = () => {

// Estado para el peso ingresado por el usuario
  const [peso, setPeso] = useState("");

  // Estado para la altura ingresada por el usuario
  const [altura, setAltura] = useState("");

  // Estado para guardar el resultado del cálculo (IMC y categoría)
  const [resultado, setResultado] = useState(null);

  // Función que calcula el IMC cuando el usuario hace clic en "Calcular"
  const calcularIMC = () => {
    if (peso && altura) {
      const imc = (peso / (altura * altura)).toFixed(2);
      let categoria = "";
      if (imc < 18.5) categoria = "Bajo peso";
      else if (imc < 24.9) categoria = "Peso normal";
      else if (imc < 29.9) categoria = "Sobrepeso";
      else categoria = "Obesidad";

      // Actualiza el estado con el resultado y la categoría
      setResultado(`Tu IMC es ${imc} (${categoria})`);
    }
  };

  // Renderiza la interfaz de la calculadora
  return (
    <div style={{ padding: "20px" }}>
      <h2>Calculadora de IMC</h2>

      {/* Campo para ingresar el peso */}
      <input
        type="number"
        placeholder="Peso (kg)"
        value={peso}
        onChange={(e) => setPeso(e.target.value)} // Actualiza el estado peso
      />

      {/* Campo para ingresar la altura */}
      <input
        type="number"
        placeholder="Altura (m)"
        value={altura}
        onChange={(e) => setAltura(e.target.value)} // Actualiza el estado altura
      />

      {/* Botón que ejecuta la función calcularIMC */}
      <button onClick={calcularIMC}>Calcular</button>

      {/* Si hay resultado, lo muestra en pantalla */}
      {resultado && <p>{resultado}</p>}
    </div>
  );
};

export default CalculadoraIMC;