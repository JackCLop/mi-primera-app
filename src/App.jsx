import { useState } from "react";

// Estilos CSS incrustados directamente en el archivo
const styles = `
  body {
    background-color: #f0f4f8;
    color: #2d3748;
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
  .app-container {
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    text-align: center;
  }
  h1 {
    color: #4a5568;
    margin-bottom: 20px;
  }
  .inputs, .preguntas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 30px; /* Espacio aumentado entre los inputs y preguntas */
    margin-bottom: 30px;
  }
  label {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    font-weight: 600;
    min-height: 80px; /* Asegura que todas las etiquetas tengan la misma altura */
  }
  input, select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
  }
  #resultado {
    background-color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    text-align: left;
    margin-bottom: 30px;
  }
  h2 {
    color: #4a5568;
    margin-top: 0;
  }
  .detalles {
    padding: 0;
    list-style: none;
  }
  .detalle-item {
    background-color: #f7fafc;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 12px;
    border: 1px solid #e2e8e0;
    text-align: left;
  }
  .detalle-item p {
    margin: 0;
    padding: 2px 0;
  }
  .acciones {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  button {
    background-color: #4c51bf;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #5a64a6;
  }
`;

export default function App() {
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);

  const [confesion, setConfesion] = useState("no");
  const [interes, setInteres] = useState("no");
  const [terminacion, setTerminacion] = useState("no");
  const [conclusion, setConclusion] = useState("no");

  // Convertir a días. Nota: Se usa una aproximación de 365 días por año y 30 días por mes.
  const totalDiasInicial = years * 365 + months * 30 + days;

  let penaActual = totalDiasInicial;
  let detalles = [];

  if (confesion === "si") {
    const descuento = Math.floor(penaActual / 3);
    detalles.push({
      nombre: "Confesión sincer",
      descuento,
      restante: penaActual - descuento,
    });
    penaActual -= descuento;
  }

  if (interes === "si") {
    const descuento = Math.floor(penaActual / 4);
    detalles.push({
      nombre: "Interés superior del niño",
      descuento,
      restante: penaActual - descuento,
    });
    penaActual -= descuento;
  }

  if (terminacion === "si") {
    const descuento = Math.floor(penaActual / 6);
    detalles.push({
      nombre: "Terminación anticipada",
      descuento,
      restante: penaActual - descuento,
    });
    penaActual -= descuento;
  }

  if (conclusion === "si") {
    const descuento = Math.floor(penaActual / 7);
    detalles.push({
      nombre: "Conclusión anticipada",
      descuento,
      restante: penaActual - descuento,
    });
    penaActual -= descuento;
  }

  // Convierte los días totales a años, meses y días, usando la misma aproximación
  const convertirDias = (dias) => {
    let D = Math.max(0, dias);
    const años = Math.floor(D / 365);
    D %= 365;
    const meses = Math.floor(D / 30);
    const diasRestantes = D % 30;
    return `${años} años, ${meses} meses, ${diasRestantes} días`;
  };

  // --- Vista previa en ventana nueva ---
  const handleVistaPrevia = () => {
    const newWindow = window.open("", "_blank", "width=800,height=600");
    const detallesHtml = detalles.length > 0 ? 
      `<h3>Detalle de beneficios aplicados</h3>
       <div class="detalles">
         ${detalles.map(d => `
           <div class="detalle-item">
             <p><strong>${d.nombre}</strong></p>
             <p>Descuento: -${convertirDias(d.descuento)}</p>
             <p>Nueva pena: ${convertirDias(d.restante)}</p>
           </div>
         `).join('')}
       </div>`
      : '';

    newWindow.document.write(`
      <html>
        <head>
          <title>Vista Previa de Pena</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #2c3e50; }
            .detalles { margin-top: 10px; }
            .detalle-item {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 10px;
              margin-bottom: 8px;
            }
            .detalle-item p { margin: 0; }
          </style>
        </head>
        <body>
          <h2>Resultado</h2>
          <p><strong>Pena inicial:</strong> ${convertirDias(totalDiasInicial)}</p>
          <p><strong>Pena final:</strong> ${convertirDias(penaActual)}</p>
          ${detallesHtml}
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  // --- Imprimir directamente ---
  const handleImprimir = () => {
    window.print();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <h1>Simulador de Pena</h1>

        {/* Formulario */}
        <div className="inputs">
          <label>
            Años
            <input
              type="number"
              min="0"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </label>
          <label>
            Meses
            <input
              type="number"
              min="0"
              max="11"
              value={months}
              onChange={(e) =>
                setMonths(Math.min(11, Math.max(0, Number(e.target.value))))
              }
            />
          </label>
          <label>
            Días
            <input
              type="number"
              min="0"
              max="30"
              value={days}
              onChange={(e) =>
                setDays(Math.min(30, Math.max(0, Number(e.target.value))))
              }
            />
          </label>
        </div>

        {/* Preguntas */}
        <div className="preguntas">
          <label>
            <span>Confesión sincera:</span>
            <select
              value={confesion}
              onChange={(e) => setConfesion(e.target.value)}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </label>

          <label>
            <span>Interés superior del niño:</span>
            <select
              value={interes}
              onChange={(e) => setInteres(e.target.value)}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </label>

          <label>
            <span>Terminación anticipada:</span>
            <select
              value={terminacion}
              onChange={(e) => setTerminacion(e.target.value)}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </label>

          <label>
            <span>Conclusión anticipada:</span>
            <select
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </label>
        </div>

        {/* Resultados */}
        <div id="resultado">
          <h2>Resultado</h2>
          <p>
            <strong>Pena inicial:</strong> {convertirDias(totalDiasInicial)}
          </p>
          <p>
            <strong>Pena final:</strong> {convertirDias(penaActual)}
          </p>

          {detalles.length > 0 && (
            <div className="detalles">
              <h3>Detalle de beneficios aplicados</h3>
              {detalles.map((d, i) => (
                <div key={i} className="detalle-item">
                  <p><strong>{d.nombre}</strong></p>
                  <p>Descuento: -{convertirDias(d.descuento)}</p>
                  <p>Nueva pena: {convertirDias(d.restante)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="acciones">
          <button onClick={handleVistaPrevia}>Vista Previa</button>
          <button onClick={handleImprimir}>Imprimir / PDF</button>
        </div>
      </div>
    </>
  );
}
