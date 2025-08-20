
'use client';
import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';

type Flavor = { id: string; name: string; };
export type BuildBoxProps = {
  size: number;
  flavors: Flavor[];
  initial?: Record<string, number>;
  onChange?: (box: Record<string, number>) => void;
  limits?: Record<number, number>;
};

const STORAGE_KEY = 'ayumi.box';

/** Drag & drop nativo:
 *  Arrastra tarjetas de sabor hacia los slots de la caja.
 *  Click en slot = quitar.
 */
export default function BuildBoxDnD({ size, flavors, initial, onChange, limits }: BuildBoxProps) {
  const defaultLimits: Record<number, number> = { 6: 2, 9: 3, 12: 4 };
  const limit = useMemo(() => limits?.[size] ?? defaultLimits[size] ?? size, [limits, size]);
  const [slots, setSlots] = useState<(string | null)[]>(() => Array(size).fill(null));

  function sanitize(arr: (string | null)[]) {
    const counts: Record<string, number> = {};
    return arr
      .slice(0, size)
      .map(id => {
        if (!id) return null;
        const c = (counts[id] || 0) + 1;
        counts[id] = c;
        if (c > limit) return null;
        return id;
      })
      .concat(Array(Math.max(0, size - arr.length)).fill(null));
  }

  useEffect(() => {
    const arr = Array(size).fill(null);
    let source: any[] | null = null;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) source = parsed;
        } catch {}
      }
    }
    if (!source && initial) {
      source = [];
      Object.entries(initial).forEach(([id, qty]) => {
        for (let i = 0; i < qty; i++) source!.push(id);
      });
    }
    if (source) {
      for (let i = 0; i < size && i < source.length; i++) arr[i] = source[i];
    }
    const sanitized = sanitize(arr);
    setSlots(sanitized);
    notify(sanitized);
  }, [size, initial, limit]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (slots.every(s => !s)) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    }
  }, [slots]);

  function handleDrop(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    setSlots(prev => {
      const count = prev.filter(x => x === id).length;
      const replacingSame = prev[index] === id;
      if (!replacingSame && count >= limit) return prev;
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
    setSlots(prev => {
      const n = [...prev];
      n[i] = null;
      notify(n);
      return n;
    });
  }

  function addFlavor(id: string) {
    setSlots(prev => {
      const count = prev.filter(x => x === id).length;
      if (count >= limit) return prev;
      const index = prev.findIndex(x => x === null);
      if (index === -1) return prev;
      const next = [...prev];
      next[index] = id;
      notify(next);
      return next;
    });
  }

  function reset() {
    const empty = Array(size).fill(null);
    setSlots(empty);
    notify(empty);
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
      <div className="flex items-center justify-between text-sm opacity-70">
        <div>Arrastra sabores a la caja • Llevas {Object.values(counts).reduce((a,b)=>a+b,0)}/{size}</div>
        <button onClick={reset} className="text-xs underline">Reset</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {flavors.map(f => (
          <div
            key={f.id}
            draggable
            onDragStart={(e) => handleDrag(e, f.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                addFlavor(f.id);
              }
            }}
            tabIndex={0}
            role="button"
            className="border rounded p-3 bg-white shadow-card cursor-grab active:cursor-grabbing focus:outline-none focus:ring">
            <div className="font-medium">{f.name}</div>
            <div className="text-xs opacity-70">En caja: {counts[f.id] ?? 0}/{limit}</div>
            <div className="text-xs opacity-70">Arrastra o pulsa Enter →</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {slots.map((id, i) => (
          <div
            key={i}
            onDrop={(e) => handleDrop(e, i)}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => id && clearSlot(i)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && id) {
                e.preventDefault();
                clearSlot(i);
              }
            }}
            tabIndex={0}
            role="button"
            className={clsx(
              'h-16 rounded-lg2 border flex items-center justify-center text-sm select-none',
              id ? 'bg-mora text-white' : 'bg-white'
            )}
          >
            {id ? flavors.find(f => f.id === id)?.name : 'Vacío'}
          </div>
        ))}
      </div>
      <p className="text-xs opacity-60">Click o Enter en un slot para quitarlo.</p>
    </div>
  );
}
