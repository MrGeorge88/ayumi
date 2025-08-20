
import { NextResponse } from 'next/server';
export async function GET() {
  // Devuelve oferta activa de entrada (demo)
  return NextResponse.json({ type:'percent', value:15, description:'-15% primer mes' });
}
