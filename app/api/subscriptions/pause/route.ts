
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  // TODO: update subscriptions.status='paused'
  return NextResponse.json({ ok: true });
}
