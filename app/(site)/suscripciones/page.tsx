"use client";
import { useEffect, useMemo, useState } from "react";
import BuildBoxDnD from "@/components/BuildBoxDnD";
import OfferBanner from "@/components/OfferBanner";

type Flavor = { id: string; name: string };
const mockFlavors: Flavor[] = [
  { id: "babaco", name: "Babaco" },
  { id: "fresa", name: "Fresa" },
  { id: "mora", name: "Mora" },
  { id: "maracuya", name: "Maracuyá" },
  { id: "vainilla", name: "Vainilla" },
  { id: "cafe", name: "Café" },
];

export default function Suscripciones({ searchParams }: any) {
  const initialPlan = Number(searchParams?.plan ?? 9);
  const initialFreq = (searchParams?.freq as any) ?? "semanal";
  const [size, setSize] = useState(initialPlan);
  const [freq, setFreq] = useState<"semanal" | "quincenal" | "mensual">(initialFreq);
  const [box, setBox] = useState<Record<string, number>>({});
  const [initialBox, setInitialBox] = useState<Record<string, number>>();
  const [referral, setReferral] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("referralCode") || "";
    setReferral(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedArr = localStorage.getItem("ayumi.box");
    const quiz = localStorage.getItem("ayumi-quiz-box");
    let savedRecord: Record<string, number> | null = null;
    if (savedArr) {
      try {
        const arr: string[] = JSON.parse(savedArr);
        savedRecord = arr.reduce<Record<string, number>>((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});
      } catch {}
    }
    if (searchParams?.fromQuiz && quiz) {
      const quizRecord = JSON.parse(quiz) as Record<string, number>;
      let useQuiz = true;
      if (savedRecord && JSON.stringify(savedRecord) !== JSON.stringify(quizRecord)) {
        useQuiz = window.confirm("Ya tienes una caja guardada. ¿Deseas reemplazarla con la sugerida?");
      }
      const chosen = useQuiz ? quizRecord : savedRecord || quizRecord;
      setInitialBox(chosen);
      setBox(chosen);
      const arr: string[] = [];
      Object.entries(chosen).forEach(([id, qty]) => {
        for (let i = 0; i < qty; i++) arr.push(id);
      });
      localStorage.setItem("ayumi.box", JSON.stringify(arr));
      localStorage.removeItem("ayumi-quiz-box");
    } else if (savedRecord) {
      setInitialBox(savedRecord);
      setBox(savedRecord);
    }
  }, [searchParams]);

  function handleChange(b: Record<string, number>) {
    setBox(b);
    setInitialBox(b);
  }

  function handleReferralChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setReferral(value);
    if (typeof window !== "undefined") localStorage.setItem("referralCode", value);
  }

  const remaining = useMemo(
    () => size - Object.values(box).reduce((a, b) => a + b, 0),
    [box, size]
  );

  function checkout() {
    alert(
      `Simulación checkout => size:${size}, freq:${freq}, box:${JSON.stringify(box)}`
    );
    // TODO: POST /api/checkout
  }

  return (
    <div className="space-y-8">
      <OfferBanner />
      <h1 className="text-2xl font-bold">Suscripción AYUMI</h1>
      <section className="grid md:grid-cols-4 gap-4">
        {[6, 9, 12].map((n) => (
          <button
            key={n}
            className={
              "rounded-xl p-4 shadow-card bg-white border " +
              (n === size ? "border-mora" : "")
            }
            onClick={() => setSize(n)}
            id={`plan-${n}`}
          >
            <div className="font-semibold">Caja {n}</div>
            <div className="text-sm opacity-70">{n === 9 ? "La más popular" : ""}</div>
          </button>
        ))}
        <div className="rounded-xl p-4 shadow-card bg-white">
          <div className="font-semibold mb-2">Frecuencia</div>
          <div className="flex gap-2">
            {["semanal", "quincenal", "mensual"].map((f: any) => (
              <button
                key={f}
                onClick={() => setFreq(f)}
                className={
                  "px-3 py-1 rounded-lg2 border " +
                  (f === freq ? "bg-mora text-white" : "")
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl p-4 shadow-card bg-white">
        <label className="font-semibold mb-2 block">Tengo código de referido</label>
        <input
          type="text"
          value={referral}
          onChange={handleReferralChange}
          placeholder="Ingresa tu código"
          className="border rounded-lg2 px-3 py-2 w-full"
        />
      </section>

      <section className="rounded-xl p-4 shadow-card bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Elige sabores (Drag & Drop)</h2>
          <div className="text-sm opacity-80">Restan {remaining}</div>
        </div>
        <BuildBoxDnD
          size={size}
          flavors={mockFlavors}
          initial={initialBox}
          onChange={handleChange}
        />
        <div className="mt-4 text-right">
          <button
            disabled={remaining > 0}
            onClick={checkout}
            className="bg-mora text-white px-4 py-2 rounded-lg2 disabled:opacity-50"
          >
            Pagar y suscribirme
          </button>
        </div>
      </section>
    </div>
  );
}
