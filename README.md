
# AYUMI PRO — Next.js + Supabase + Vercel

Incluye:
- **Build‑a‑Box con drag & drop nativo** (`components/BuildBoxDnD.tsx`)
- **/suscripciones** (plan + frecuencia + caja)
- **/quiz** (onboarding de 6 pasos que preconfigura el plan)
- **/portal** (pausar / reanudar / saltar semana – mocks)
- API: checkout, pause/skip, offers, referrals + cron renovaciones
- Supabase `schema.sql` con tablas de ofertas, referidos y skips

## Arranque
```
npm i
npm run dev
```
Crea `.env.local` con llaves de Supabase y del gateway de pago.

## Próximos pasos
- Conectar productos reales desde `products`.
- Implementar `POST /api/checkout` con tu gateway (Kushki).
- Vercel Cron + Webhook de pagos.
- Panel `/admin` para gestionar sabores, cupones y campañas.
