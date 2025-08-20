
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const { subscriptionId, action } = await req.json();
  const status = action === 'pause' ? 'paused' : 'active';
  const supabase = supabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({ status })
    .eq('id', subscriptionId);
  return NextResponse.json({ ok: true, status });
}
