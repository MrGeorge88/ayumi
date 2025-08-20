
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  // TODO: generar código y registrar campaña
  return NextResponse.json({ code: 'AYU-' + Math.random().toString(36).slice(2,7).toUpperCase() });
}
