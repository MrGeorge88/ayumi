
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AYUMI",
  description: "Yogurt griego alto en proteína, endulzado con alulosa."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <header className="sticky top-0 z-20 bg-yogurt/80 backdrop-blur border-b">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-extrabold text-mora text-xl">AYUMI</a>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="/suscripciones">Suscripciones</a>
              <a href="/quiz">Quiz</a>
              <a href="/sabores">Sabores</a>
              <a href="/ayuda">Ayuda</a>
            </nav>
            <a className="bg-mora text-white px-4 py-2 rounded-lg2" href="https://wa.me/0000000000">WhatsApp</a>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 bg-black text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg">AYUMI</h3>
              <p className="text-sm opacity-80">Yogurt griego alto en proteína, endulzado con alulosa.</p>
            </div>
            <div>
              <h4 className="font-semibold">Links</h4>
              <ul className="text-sm opacity-80 space-y-1">
                <li><a href="/suscripciones">Suscripciones</a></li>
                <li><a href="/quiz">Quiz</a></li>
                <li><a href="/ayuda">Ayuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Contacto</h4>
              <p className="text-sm opacity-80">hola@ayumi.ec</p>
              <div className="text-sm opacity-80">© AYUMI 2025</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
