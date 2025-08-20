
'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
type Ans = Record<string, string>;
const steps = [
  { key:'objetivo', q:'¿Cuál es tu objetivo principal?', opts:['Alto en proteína','Cero azúcar añadida','Balance sabor-salud'] },
  { key:'dulzor', q:'Preferencia de dulzor', opts:['Bajo','Medio','Alto'] },
  { key:'frutas', q:'¿Qué frutas prefieres?', opts:['Tropicales','Frutos rojos','Cítricos'] },
  { key:'tolerancia', q:'¿Tienes alguna restricción/alergia?', opts:['Ninguna','Lactosa','Frutos secos'] },
  { key:'frecuencia', q:'¿Con qué frecuencia quieres recibir?', opts:['semanal','quincenal','mensual'] },
  { key:'tamano', q:'¿Qué tamaño de caja prefieres?', opts:['6','9','12'] }
];
export default function Quiz() {
  const [i,setI]=useState(0); const [ans,setAns]=useState<Ans>({});
  const router = useRouter();
  const s = steps[i];
  function choose(opt:string){ setAns(a=>({...a,[s.key]:opt})); if(i<steps.length-1) setI(i+1); else finish(); }
  function finish(){
    // Reglas simples para demo
    const size = Number(ans['tamano'] ?? 9);
    const freq = (ans['frecuencia'] as any) ?? 'semanal';
    // Prefill sabores
    const flavors = ans['frutas']==='Tropicales' ? ['babaco','maracuya','vainilla'] :
                    ans['frutas']==='Cítricos' ? ['maracuya','vainilla','fresa'] :
                    ['fresa','mora','vainilla'];
    const params = new URLSearchParams({ plan:String(size), freq });
    router.push('/suscripciones?'+params.toString());
  }
  return (
    <div className="max-w-lg mx-auto rounded-xl p-6 shadow-card bg-white">
      <div className="text-sm opacity-70 mb-2">Paso {i+1} de {steps.length}</div>
      <h1 className="text-xl font-semibold mb-4">{s.q}</h1>
      <div className="grid gap-2">
        {s.opts.map(o=>(
          <button key={o} onClick={()=>choose(o)} className="border rounded-lg2 px-4 py-3 text-left hover:border-mora">{o}</button>
        ))}
      </div>
      <div className="text-center text-sm opacity-70 mt-4">Personalizamos tu plan según tus respuestas.</div>
    </div>
  );
}
