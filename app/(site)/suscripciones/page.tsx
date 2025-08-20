
'use client';
import { useMemo, useState } from 'react';
import BuildBoxDnD from '@/components/BuildBoxDnD';

type Flavor = { id: string; name: string; };
const mockFlavors: Flavor[] = [
  { id: 'babaco', name: 'Babaco' },
  { id: 'fresa', name: 'Fresa' },
  { id: 'mora', name: 'Mora' },
  { id: 'maracuya', name: 'Maracuyá' },
  { id: 'vainilla', name: 'Vainilla' },
  { id: 'cafe', name: 'Café' },
];

export default function Suscripciones({ searchParams }: any) {
  const initialPlan = Number(searchParams?.plan ?? 9);
  const [size, setSize] = useState(initialPlan);
  const [freq, setFreq] = useState<'semanal'|'quincenal'|'mensual'>('semanal');
  const [box, setBox] = useState<Record<string, number>>({});

  const remaining = useMemo(() => size - Object.values(box).reduce((a,b)=>a+b,0), [box, size]);
  function checkout() {
    alert(`Simulación checkout => size:${size}, freq:${freq}, box:${JSON.stringify(box)}`);
    // TODO: POST /api/checkout
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Suscripción AYUMI</h1>
      <section className="grid md:grid-cols-4 gap-4">
        {[6,9,12].map(n => (
          <button key={n}
            className={"rounded-xl p-4 shadow-card bg-white border " + (n===size?'border-mora':'')}
            onClick={()=>setSize(n)} id={`plan-${n}`}>
            <div className="font-semibold">Caja {n}</div>
            <div className="text-sm opacity-70">{n===9?'La más popular':''}</div>
          </button>
        ))}
        <div className="rounded-xl p-4 shadow-card bg-white">
          <div className="font-semibold mb-2">Frecuencia</div>
          <div className="flex gap-2">
            {['semanal','quincenal','mensual'].map((f:any)=>(
              <button key={f} onClick={()=>setFreq(f)} className={"px-3 py-1 rounded-lg2 border " + (f===freq?'bg-mora text-white':'')}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl p-4 shadow-card bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Elige sabores (Drag & Drop)</h2>
          <div className="text-sm opacity-80">Restan {remaining}</div>
        </div>
        <BuildBoxDnD size={size} flavors={mockFlavors} onChange={setBox} />
        <div className="mt-4 text-right">
          <button disabled={remaining>0} onClick={checkout} className="bg-mora text-white px-4 py-2 rounded-lg2 disabled:opacity-50">Pagar y suscribirme</button>
        </div>
      </section>
    </div>
  );
}
