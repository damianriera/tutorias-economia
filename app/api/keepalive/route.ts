import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "@/lib/supabase/config";

// Vercel Cron la llama una vez por día (vercel.json) para que el proyecto gratuito
// de Supabase no se pause por inactividad. No devuelve datos.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!supabaseConfigurado()) return NextResponse.json({ ok: false, error: "sin configuración" }, { status: 500 });
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  // Consulta liviana: sin sesión, RLS no devuelve filas, pero la base registra actividad.
  const { error } = await supabase.from("datos_transicion").select("id").limit(1);
  return NextResponse.json({ ok: !error });
}
