-- Esquema del buscador de transición. Pegar y ejecutar una vez en
-- Supabase → SQL Editor. Se puede volver a ejecutar sin romper nada.

-- Correos de tutores/as que pueden ver datos de estudiantes.
create table if not exists public.autorizados (
  email text primary key check (email = lower(email)),
  nombre text,
  creado timestamptz not null default now()
);

-- Conjunto de datos vigente (planilla + historia académica de SIU Guaraní).
-- Una sola fila con id = 'actual'; la carga el script scripts/cargar_datos.py.
create table if not exists public.datos_transicion (
  id text primary key,
  contenido jsonb not null,
  actualizado timestamptz not null default now()
);

alter table public.autorizados enable row level security;
alter table public.datos_transicion enable row level security;

-- Nadie lee ni escribe estas tablas desde el navegador salvo lo que permiten
-- las políticas de abajo. La carga de datos usa la clave secreta (service_role),
-- que saltea RLS y nunca va al sitio ni al repositorio.
revoke all on public.autorizados from anon, authenticated;
revoke all on public.datos_transicion from anon, authenticated;
grant select on public.autorizados to authenticated;
grant select on public.datos_transicion to authenticated;

-- ¿El usuario que hace la consulta está en la lista de autorizados?
create or replace function public.es_autorizado()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.autorizados a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.es_autorizado() from public, anon;
grant execute on function public.es_autorizado() to authenticated;

drop policy if exists "cada uno ve su propia autorizacion" on public.autorizados;
create policy "cada uno ve su propia autorizacion" on public.autorizados
  for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "solo autorizados leen datos" on public.datos_transicion;
create policy "solo autorizados leen datos" on public.datos_transicion
  for select to authenticated
  using (public.es_autorizado());

-- Ejemplo: autorizar a una persona (además hay que crearle el usuario en
-- Authentication → Users → Add user).
-- insert into public.autorizados (email, nombre) values ('tutor@ejemplo.com', 'Nombre Apellido');
