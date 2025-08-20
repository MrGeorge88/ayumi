import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Mock catalog with prices in cents
const CATALOG: Record<string, { price: number }> = {
  COFFEE_BOX: { price: 1500 },
  MATCHA_BOX: { price: 1800 },
};

// In-memory cache for idempotency handling
const idemCache = new Map<string, any>();

export async function POST(req: NextRequest) {
  const key = req.headers.get('Idempotency-Key');
  if (!key) {
    return NextResponse.json(
      { error: 'Idempotency-Key header required' },
      { status: 400 }
    );
  }
  if (idemCache.has(key)) {
    return NextResponse.json(idemCache.get(key));
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body?.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Invalid cart' }, { status: 400 });
  }

  for (const item of body.items) {
    if (!CATALOG[item.productId]) {
      return NextResponse.json(
        { error: `Unknown product ${item.productId}` },
        { status: 400 }
      );
    }
  }

  const subscription = { id: randomUUID(), status: 'active' };
  const order = {
    id: randomUUID(),
    subscriptionId: subscription.id,
    items: body.items,
  };
  const amount = body.items.reduce(
    (sum: number, item: { productId: string; quantity: number }) =>
      sum + CATALOG[item.productId].price * (item.quantity ?? 1),
    0
  );
  const payment = {
    id: randomUUID(),
    orderId: order.id,
    amount,
    status: 'authorized',
  };

  try {
    const supabase = supabaseAdmin();
    await supabase.from('events').insert({
      user_id: body.userId ?? null,
      type: 'checkout_complete',
      payload: { subscription, order, payment },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to log event', err);
  }

  const response = { ok: true, subscription, order, payment };
  idemCache.set(key, response);
  return NextResponse.json(response);
}
