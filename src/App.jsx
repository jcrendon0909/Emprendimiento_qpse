import React, { useState } from 'react';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado('Guardando en MongoDB...');

    try {
      const res = await fetch('/api/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, mensaje, fecha: new Date() }),
      });

      const data = await res.json();
      if (data.success) {
        setEstado('✅ Guardado con éxito en MongoDB');
        setNombre('');
        setMensaje('');
      } else {
        setEstado(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setEstado(`❌ Error de red: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2 text-center">
          GōkuLab - Agente QPSE
        </h1>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Metodología Querer, Poder y Saber Emprender
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Nombre del Emprendedor / Empresa
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Ej. Juan Carlos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Diagnóstico o Nota
            </label>
            <textarea
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 h-24"
              placeholder="Escribe un avance del diagnóstico..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold text-slate-950 py-2 rounded-lg transition-colors"
          >
            Registrar Diagnóstico
          </button>
        </form>

        {estado && (
          <div className="mt-4 p-3 rounded bg-slate-900 text-sm text-center border border-slate-700 text-slate-300">
            {estado}
          </div>
        )}
      </div>
    </div>
  );
}