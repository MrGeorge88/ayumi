
'use client';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';

type Flavor = { id: string; name: string; };
export type BuildBoxProps = {
  size: number;
  flavors: Flavor[];
  initial?: Record<string, number>;
  onChange?: (box: Record<string, number>) => void;
};

/** Drag & drop nativo:
 *  Arrastra tarjetas de sabor hacia los slots de la caja.
 *  Click en slot = quitar.
 */
export default function BuildBoxDnD({ size, flavors, initial, onChange }: BuildBoxProps) {
  const [slots, setSlots] = useState<(string|null)[]>(() => {
    const arr = Array(size).fill(null);
    if (initial) {
      let idx = 0;
      Object.entries(initial).forEach(([id, qty]) => {
        for (let i=0;i<qty;i++) { if (idx < arr.length) arr[idx++] = id; }
      });
    }
    return arr;
  });

  function handleDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    setSlots(prev => {
      const next = [...prev];
      next[index] = id;
      notify(next);
      return next;
    });
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.dataTransfer.setData('text/plain', id);
  }

  function clearSlot(i: number) {
    setSlots(prev => { const n=[...prev]; n[i]=null; notify(n); return n; });
  }

  function notify(arr: (string|null)[]) {
    if (!onChange) return;
    const box: Record<string, number> = {};
    arr.forEach(id => { if (id) box[id] = (box[id]||0)+1; });
    onChange(box);
  }

  const counts = useMemo(() => {
    const box: Record<string, number> = {};
    slots.forEach(id => { if (id) box[id] = (box[id]||0)+1; });
    return box;
  }, [slots]);

  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">Arrastra sabores a la caja • Llevas {Object.values(counts).reduce((a,b)=>a+b,0)}/{size}</div>
      <div className="grid md:grid-cols-3 gap-3">
        {flavors.map(f => (
          <div key={f.id}
               draggable
               onDragStart={(e)=>handleDrag(e, f.id)}
               className="border rounded p-3 bg-white shadow-card cursor-grab active:cursor-grabbing">
            <div className="font-medium">{f.name}</div>
            <div className="text-xs opacity-70">En caja: {counts[f.id] ?? 0}</div>
            <div className="text-xs opacity-70">Arrastra hacia la caja →</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {slots.map((id, i) => (
          <div key={i}
               onDrop={(e)=>handleDrop(e, i)}
               onDragOver={(e)=>e.preventDefault()}
               onClick={()=>id && clearSlot(i)}
               className={clsx("h-16 rounded-lg2 border flex items-center justify-center text-sm select-none",
                               id ? "bg-mora text-white" : "bg-white")}>
            {id ? flavors.find(f=>f.id===id)?.name : "Vacío"}
          </div>
        ))}
      </div>
      <p className="text-xs opacity-60">Click en un slot para quitarlo.</p>
    </div>
  );
}
