import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "@/lib/supabase/config";

// Rutas que se pueden ver sin sesión.
const PUBLICAS = ["/login", "/auth/", "/api/keepalive"];

export async function proxy(request: NextRequest) {
  const ruta = request.nextUrl.pathname;
  const esPublica = PUBLICAS.some((p) => ruta === p || ruta.startsWith(p));

  if (!supabaseConfigurado()) {
    // Sin configuración no hay forma de autenticar: no se muestra nada protegido.
    return esPublica ? NextResponse.next() : redirigir(request, "/login");
  }

  let respuesta = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  // getUser() valida el token contra Supabase y lo renueva si hace falta.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !esPublica) {
    const destino = redirigir(request, "/login");
    respuesta.cookies.getAll().forEach((c) => destino.cookies.set(c));
    return destino;
  }
  return respuesta;
}

function redirigir(request: NextRequest, ruta: string) {
  const url = request.nextUrl.clone();
  url.pathname = ruta;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
