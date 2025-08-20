
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: validar, crear subscripción + order + pago inicial (Kushki).
  return NextResponse.json({ ok: true, body });
}
