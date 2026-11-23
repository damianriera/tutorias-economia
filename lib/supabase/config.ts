// Variables públicas de Supabase (URL y clave "publishable"/anon). No son secretas:
// la protección real de los datos está en las políticas RLS (supabase/esquema.sql).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function supabaseConfigurado() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}
