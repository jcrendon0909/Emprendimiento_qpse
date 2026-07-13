import React, { useState } from 'react';

export default function Wizard() {
  // Controlamos el paso actual (1: Foto Rápida, 2: Cliente y Servicio, etc.)
  const [paso, setPaso] = useState(1);
  const [narrativa, setNarrativa] = useState("");
  const [cargando, setCargando] = useState(false);
  const [preguntaSocratica, setPreguntaSocratica] = useState("");

  const pasosTotales = 4; // Ajustable según los bloques que habilites

  const manejarSiguiente = async () => {
    setCargando(true);
    setPreguntaSocratica(""); // Limpiamos preguntas previas

    try {
      // Aquí simulamos la llamada a tu API en Cloudflare que conecta con DeepSeek
      // const res = await fetch('/api/diagnostico/foto-rapida', { method: 'POST', body: JSON.stringify({ narrativa }) });
      // const data = await res.json();
      
      // MOCK DE PRUEBA: Simulemos que DeepSeek nos pide profundizar
      setTimeout(() => {
        const respuestaMockIA = {
          intervencion_socratica: "Mencionas que el dinero no alcanza, pero no registras gastos. ¿Qué es lo primero que compraste esta semana que no anotaste?"
        };

        if (respuestaMockIA.intervencion_socratica && !preguntaSocratica) {
          // Si la IA detecta debilidad en la respuesta, la muestra y frena el avance
          setPreguntaSocratica(respuestaMockIA.intervencion_socratica);
        } else {
          // Si todo está bien o el usuario ya respondió a la confrontación, avanza
          setPaso(paso + 1);
          setNarrativa("");
          setPreguntaSocratica("");
        }
        setCargando(false);
      }, 1500);

    } catch (error) {
      console.error("Error al procesar con DeepSeek:", error);
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      
      {/* 1. Barra de Progreso */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
          <span>Progreso del Diagnóstico</span>
          <span>Paso {paso} de {pasosTotales}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(paso / pasosTotales) * 100}%` }}
          />
        </div>
      </div>

      {/* 2. Zona Dinámica de Captura */}
      {paso === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bloque 1: Foto Rápida de tu Negocio</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Cuéntanos de tu negocio: ¿A qué se dedica?, ¿cuántas personas colaboran contigo?, ¿cómo manejas tus horarios y qué es lo que más te estresa hoy en día?
          </p>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-700"
            placeholder="Escribe aquí con total libertad y detalle..."
            value={narrativa}
            onChange={(e) => setNarrativa(e.target.value)}
            disabled={cargando}
          />
        </div>
      )}

      {/* 3. El Espejo de la IA (Intervención Socrática) */}
      {preguntaSocratica && (
        <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg animate-fade-in">
          <p className="text-sm font-semibold text-amber-800 mb-1">💡 El Consultor Virtual sugiere:</p>
          <p className="text-sm text-amber-700">{preguntaSocratica}</p>
          <p className="text-xs text-amber-600 mt-2 italic">*Complementa tu respuesta arriba y presiona continuar.*</p>
        </div>
      )}

      {/* Botón de Acción */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={manejarSiguiente}
          disabled={cargando || !narrativa.trim()}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
        >
          {cargando ? "Analizando con DeepSeek..." : "Continuar"}
        </button>
      </div>

    </div>
  );
}