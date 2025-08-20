
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  // TODO: insertar en subscription_skips y mover next_renewal_date
  return NextResponse.json({ ok: true });
}
