
'use client';
import { useState } from 'react';

export default function Portal() {
  // TODO: obtener datos reales de la suscripción actual
  const subscriptionId = 'demo-subscription';
  const [status, setStatus] = useState<'active' | 'paused'>('active');
  const [nextDate, setNextDate] = useState('2025-09-01'); // mock inicial

  async function pause() {
    await fetch('/api/subscriptions/pause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId, action: 'pause' }),
    });
    setStatus('paused');
  }

  async function resume() {
    await fetch('/api/subscriptions/pause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId, action: 'resume' }),
    });
    setStatus('active');
  }

  async function skip() {
    const res = await fetch('/api/subscriptions/skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId }),
    });
    const data = await res.json();
    if (data.next_renewal_date) setNextDate(data.next_renewal_date);
    alert('Entrega saltada');
  }
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
