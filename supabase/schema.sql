create table if not exists public.health_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 profile jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint profile_is_object check (jsonb_typeof(profile) = 'object')
);
alter table public.health_profiles enable row level security;
revoke all on public.health_profiles from anon;
grant select, insert, update, delete on public.health_profiles to authenticated;
create policy "Read own health profile" on public.health_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own health profile" on public.health_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own health profile" on public.health_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own health profile" on public.health_profiles for delete to authenticated using ((select auth.uid()) = user_id);
