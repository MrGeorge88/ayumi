
import { NextResponse } from 'next/server';
export async function GET() {
  // TODO: Buscar suscripciones con next_renewal_date = hoy, crear orden y cobrar token.
  return NextResponse.json({ ok: true });
}
