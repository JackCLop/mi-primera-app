import { useState } from "react";
import "./App.css";
import styles from "./App.css?inline"; // 👈 Importamos CSS como texto (Vite lo permite)

export default function App() {
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);

  const [confesion, setConfesion] = useState("no");
  const [interes, setInteres] = useState("no");
  const [terminacion, setTerminacion] = useState("no");
  const [conclusion, setConclusion] = useState("no");

  const totalDiasInicial = years * 365 + months * 30 + days;
  let penaActual = totalDiasInicial;
  let detalles = [];

  if (confesion === "si") {
    const descuento = Math.floor(penaActual / 3);
    detalles.push({ nombre: "Confesión sincera:", descuento, restante: penaActual - descuento });
    penaActual -= descuento;
  }

  if (interes === "si") {
    const descuento = Math.floor(penaActual / 4);
    detalles.push({ nombre: "Interés superior del niño:", descuento, restante: penaActual - descuento });
    penaActual -= descuento;
  }

  if (terminacion === "si") {
    const descuento = Math.floor(penaActual / 6);
    detalles.push({ nombre: "Terminación anticipada:", descuento, restante: penaActual - descuento });
    penaActual -= descuento;
  }

  if (conclusion === "si") {
    const descuento = Math.floor(penaActual / 7);
    detalles.push({ nombre: "Conclusión anticipada:", descuento, restante: penaActual - descuento });
    penaActual -= descuento;
  }

  const convertirDias = (dias) => {
    let D = Math.max(0, dias);
    const años = Math.floor(D / 365);
    D %= 365;
    const meses = Math.floor(D / 30);
    const diasRestantes = D % 30;
    return `${años} años, ${meses} meses, ${diasRestantes} días`;
  };

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
          <style>${styles}</style> <!-- 👈 Aquí inyectamos todo App.css -->
        </head>
        <body>
          <div class="app-container">
            <h2>Resultado</h2>
            <p><strong>Pena inicial:</strong> ${convertirDias(totalDiasInicial)}</p>
            <p><strong>Pena final:</strong> ${convertirDias(penaActual)}</p>
            ${detallesHtml}
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <h1>⚖️ Simulador de Pena ⚖️</h1>

      {/* Formulario */}
      <div className="inputs">
        <label>
          Años:
          <input type="number" min="0" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </label>
        <label>
          Meses:
          <input type="number" min="0" max="11" value={months} onChange={(e) => setMonths(Math.min(11, Math.max(0, Number(e.target.value))))} />
        </label>
        <label>
          Días:
          <input type="number" min="0" max="30" value={days} onChange={(e) => setDays(Math.min(30, Math.max(0, Number(e.target.value))))} />
        </label>
      </div>

      {/* Preguntas */}
      <div className="preguntas">
        <label>
          Confesión sincera:
          <select value={confesion} onChange={(e) => setConfesion(e.target.value)}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </label>
        <label>
          Interés superior del niño:
          <select value={interes} onChange={(e) => setInteres(e.target.value)}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </label>
        <label>
          Terminación anticipada:
          <select value={terminacion} onChange={(e) => setTerminacion(e.target.value)}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </label>
        <label>
          Conclusión anticipada:
          <select value={conclusion} onChange={(e) => setConclusion(e.target.value)}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </label>
      </div>

      {/* Resultados */}
      <div id="resultado">
        <h2>Resultado:</h2>
        <p><strong>Pena inicial:</strong> {convertirDias(totalDiasInicial)}</p>
        <p><strong>Pena final:</strong> {convertirDias(penaActual)}</p>

        {detalles.length > 0 && (
          <div className="detalles">
            <h3>Detalle de beneficios aplicados:</h3>
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
  );
}
