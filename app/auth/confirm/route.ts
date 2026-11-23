import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { crearClienteServidor } from "@/lib/supabase/server";

// Destino de los correos de invitación y de recuperación de contraseña
// (plantillas de Supabase con {{ .TokenHash }}). Abre la sesión y lleva a
// /cuenta para que la persona elija su contraseña.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next") ?? "/cuenta";
  const destino = next.startsWith("/") && !next.startsWith("//") ? next : "/cuenta";
  if (token_hash && type) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(new URL(destino, url.origin));
  }
  return NextResponse.redirect(new URL("/login?error=enlace", url.origin));
}
