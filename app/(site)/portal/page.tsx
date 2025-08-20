
'use client';
import { useState } from 'react';
export default function Portal() {
  const [status,setStatus]=useState<'active'|'paused'>('active');
  const nextDate = '2025-09-01'; // mock
  function pause(){ setStatus('paused'); /* TODO: POST /api/subscriptions/pause */ }
  function resume(){ setStatus('active'); /* TODO: POST /api/subscriptions/pause */ }
  function skip(){ alert('Entrega saltada (demo)'); /* TODO: POST /api/subscriptions/skip */ }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mi suscripción</h1>
      <div className="rounded-xl p-4 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Estado: {status==='active'?'Activa':'Pausada'}</div>
            <div className="text-sm opacity-70">Próxima entrega: {nextDate}</div>
          </div>
          <div className="flex gap-2">
            {status==='active' ? (
              <button onClick={pause} className="px-3 py-2 border rounded-lg2">Pausar</button>
            ) : (
              <button onClick={resume} className="px-3 py-2 border rounded-lg2">Reanudar</button>
            )}
            <button onClick={skip} className="px-3 py-2 border rounded-lg2">Saltar semana</button>
          </div>
        </div>
      </div>
      <div className="rounded-xl p-4 bg-white shadow-card">
        <div className="font-semibold mb-2">Cambiar tamaño y frecuencia</div>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-1"><option>6</option><option selected>9</option><option>12</option></select>
          <select className="border rounded px-2 py-1"><option>semanal</option><option selected>quincenal</option><option>mensual</option></select>
          <button className="px-3 py-2 bg-mora text-white rounded-lg2">Guardar</button>
        </div>
      </div>
    </div>
  );
}
