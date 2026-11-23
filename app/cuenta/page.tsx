import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import CambiarClave from "./cambiar-clave";

export const dynamic = "force-dynamic";

export default async function Cuenta() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="wrap">
      <div className="lock card">
        <h2>Mi cuenta</h2>
        <p className="muted small">Sesión iniciada como {user.email}.</p>
        <CambiarClave />
        <p className="small" style={{ marginTop: 16 }}>
          <a href="/">Volver al buscador</a>
        </p>
      </div>
    </div>
  );
}
