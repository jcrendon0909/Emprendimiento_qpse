import React, { useState } from 'react';
import Wizard from './components/Wizard';
import CanvasView from './components/CanvasView';

export default function App() {
  const [completado, setCompletado] = useState(false);
    const [datosCanvas, setDatosCanvas] = useState(null);

      // Función que se ejecuta cuando el Wizard termina
        const manejarDiagnosticoFinalizado = (resultado) => {
            setDatosCanvas(resultado);
                setCompletado(true);
                  };

                    return (
                        <div className="min-h-screen bg-gray-100 py-6">
                              {!completado ? (
                                      <Wizard onCompletado={manejarDiagnosticoFinalizado} />
                                            ) : (
                                                    <CanvasView canvasData={datosCanvas} />
                                                          )}
                                                              </div>
                                                                );
                                                                }
                                                                