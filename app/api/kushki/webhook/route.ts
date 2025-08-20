
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  // TODO: verificar firma, actualizar payments/orders
  return NextResponse.json({ received: true });
}
