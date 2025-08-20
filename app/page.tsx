
import OfferBanner from '@/components/OfferBanner';

export default function Home() {
  return (
    <div className="space-y-10">
      <OfferBanner />
      <section className="rounded-lg2 shadow-card bg-yogurt p-8">
        <h1 className="text-3xl font-bold mb-2">Yogurt griego AYUMI: alto en proteína, endulzado con alulosa.</h1>
        <p className="text-lg">Suscríbete, elige sabores y recibe en frío. Sin conservantes. Con probióticos.</p>
        <div className="mt-4 flex gap-3 flex-wrap">
          <a className="bg-mora text-white px-4 py-2 rounded-lg2" href="/suscripciones">Armar mi suscripción</a>
          <a className="bg-babaco text-black px-4 py-2 rounded-lg2" href="/quiz">Probar quiz</a>
        </div>
        <p className="text-sm mt-2 opacity-70">Cobertura con cadena de frío. Quito y valles (consulta otras zonas).</p>
      </section>
    </div>
  )
}
