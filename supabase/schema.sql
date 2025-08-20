
-- EXTENSIÓN DE ESQUEMA BASE PARA FUNCIONALIDADES LÍDERES

-- Catálogo ya considerado en versión anterior:
-- products, subscriptions, subscription_items, orders, order_items, payments, profiles

-- Skips y eventos de retención
create table if not exists public.subscription_skips (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  scheduled_date date not null,
  created_at timestamptz default now()
);
alter table public.subscription_skips enable row level security;
create policy "Skips by owner" on public.subscription_skips
for select using (exists (select 1 from public.subscriptions s where s.id=subscription_id and s.user_id = auth.uid()));

-- Ofertas y cupones
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text check (type in ('percent','amount','gift')) not null,
  value integer not null, -- percent o centavos (USD*100); gift=product_id referencia en otra tabla con regla
  starts_at timestamptz default now(),
  ends_at timestamptz,
  is_active boolean default true
);
alter table public.coupons enable row level security;
create policy "Coupons readable all" on public.coupons for select using (true);

-- Referidos
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  owner_user uuid references auth.users(id) on delete cascade,
  reward_new text,   -- e.g., 'percent:15' o 'gift:TOPPING'
  reward_owner text, -- idem
  created_at timestamptz default now()
);
alter table public.referrals enable row level security;
create policy "Referrals readable all" on public.referrals for select using (true);

-- Events para analítica
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  type text, -- 'start_subscription','renewal','cancel','pause','skip','quiz_finish','checkout_error', etc.
  payload jsonb,
  created_at timestamptz default now()
);
alter table public.events enable row level security;
create policy "Events by owner" on public.events for select using (auth.uid() = user_id);

