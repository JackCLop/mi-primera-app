import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CountUp from "react-countup";
import "./App.css";
import { AiOutlineClose } from "react-icons/ai";

export default function App() {
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [previewImg, setPreviewImg] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const printRef = useRef();

  const totalDays = Math.max(
    0,
    (Number(years) || 0) * 365 +
      (Number(months) || 0) * 30 +
      (Number(days) || 0)
  );

  const beneficios = [
    {
      nombre: "Conclusión Anticipada",
      fraccion: 1 / 7,
      baseLegal:
        "Artículo 123 del Código Penal: permite la conclusión anticipada bajo determinadas condiciones."
    },
    {
      nombre: "Terminación Anticipada",
      fraccion: 1 / 6,
      baseLegal:
        "Artículo 124 del Código Penal: establece la terminación anticipada en casos específicos."
    },
    {
      nombre: "Confesión Sincera",
      fraccion: 1 / 3,
      baseLegal:
        "Artículo 125 del Código Penal: contempla la reducción de pena por confesión sincera."
    }
  ];

  const convertirDias = (dias) => {
    let D = Math.max(0, Math.floor(dias));
    const años = Math.floor(D / 365);
    D %= 365;
    const meses = Math.floor(D / 30);
    const diasRestantes = D % 30;
    return `${años} años, ${meses} meses, ${diasRestantes} días`;
  };

  const getColorClass = (fraccion) => {
    if (fraccion <= 0.15) return "pequeno";
    if (fraccion <= 0.25) return "medio";
    return "grande";
  };

  const handlePreview = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    setPreviewImg(imgData);
    setPreviewModal(true);
  };

  const handleDownloadPDF = () => {
    if (!previewImg) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(previewImg);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.setFontSize(16);
    pdf.text("Simulador de Pena - Informe", 10, 15);
    pdf.setFontSize(10);
    pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 22);

    pdf.addImage(previewImg, "PNG", 0, 30, pdfWidth, pdfHeight);
    pdf.save("SimuladorPena.pdf");
  };

  return (
    <div className="app-container">
      <h1>Simulador de Pena</h1>

      {/* Entradas */}
      <div className="inputs">
        <label>
          Años
          <input
            type="number"
            min="0"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value)))}
          />
        </label>
        <label>
          Meses
          <input
            type="number"
            min="0"
            max="11"
            value={months}
            onChange={(e) => setMonths(Math.min(11, Math.max(0, Number(e.target.value))))}
          />
        </label>
        <label>
          Días
          <input
            type="number"
            min="0"
            max="30"
            value={days}
            onChange={(e) => setDays(Math.min(30, Math.max(0, Number(e.target.value))))}
          />
        </label>
      </div>

      {/* Contenido a capturar */}
      <div ref={printRef}>
        <div className="resultados">
          <h2>Resultados</h2>
          <p>
            <strong>Pena Total:</strong> {totalDays} días ({convertirDias(totalDays)})
          </p>
        </div>

        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Beneficios Penales</h3>
        <div className="beneficios-container">
          {beneficios.map((b, i) => {
            const descuento = Math.floor(totalDays * b.fraccion);
            const penaFinal = Math.max(0, totalDays - descuento);
            const colorClass = getColorClass(b.fraccion);

            return (
              <div
                key={i}
                className={`card ${colorClass}`}
                onClick={() => setActiveCard(i)}
                style={{ cursor: "pointer" }}
              >
                <h4>{b.nombre}</h4>
                <p>
                  <strong>Descuento:</strong> {convertirDias(descuento)}
                </p>
                <p>
                  <strong>Pena Final:</strong> {convertirDias(penaFinal)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handlePreview}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#2980b9",
            color: "#fff",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Vista Previa
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#27ae60",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Descargar PDF
        </button>
      </div>

      {/* Modal de vista previa */}
      {previewModal && previewImg && (
        <div
          className="modal-overlay"
          onClick={() => setPreviewModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setPreviewModal(false)}>
              <AiOutlineClose size={24} />
            </button>
            <h3>Vista Previa PDF</h3>
            <img
              src={previewImg}
              alt="Vista Previa PDF"
              className="preview-img"
            />
          </div>
        </div>
      )}

      {/* Modal de card activa */}
      {activeCard !== null && (
        <div
          className="modal-overlay"
          onClick={() => setActiveCard(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setActiveCard(null)}
            >
              <AiOutlineClose size={24} />
            </button>
            <h3>{beneficios[activeCard].nombre}</h3>
            <p>{beneficios[activeCard].baseLegal}</p>
          </div>
        </div>
      )}
    </div>
  );
}
