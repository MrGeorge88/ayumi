
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const { subscriptionId } = await req.json();
  const supabase = supabaseAdmin();
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('next_renewal_date, frequency')
    .eq('id', subscriptionId)
    .single();

  if (!subscription) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { next_renewal_date, frequency } = subscription as {
    next_renewal_date: string;
    frequency: string;
  };

  await supabase
    .from('subscription_skips')
    .insert({ subscription_id: subscriptionId, scheduled_date: next_renewal_date });

  const date = new Date(next_renewal_date);
  let days = 7;
  if (frequency === 'biweekly' || frequency === 'quincenal') days = 14;
  if (frequency === 'monthly' || frequency === 'mensual') days = 30;
  date.setDate(date.getDate() + days);
  const newDate = date.toISOString().slice(0, 10);

  await supabase
    .from('subscriptions')
    .update({ next_renewal_date: newDate })
    .eq('id', subscriptionId);

  return NextResponse.json({ ok: true, next_renewal_date: newDate });
}
