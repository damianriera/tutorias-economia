import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/server";
import { leerDatos } from "@/lib/datos";
import Buscador from "./buscador";

// La página depende de la sesión: nunca se genera ni se cachea en forma estática.
export const dynamic = "force-dynamic";

export default async function Inicio() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { datos, error } = await leerDatos();
  if (!datos) {
    return (
      <div className="wrap">
        <div className="lock card">
          <h2>Sin datos para mostrar</h2>
          <p className="muted small">
            {error
              ? `No se pudieron leer los datos (${error}).`
              : `La cuenta ${user.email} ingresó bien, pero no está autorizada para ver datos de estudiantes o todavía no se cargaron.`}{" "}
            Pedile a la coordinación que agregue tu correo a la lista de tutores autorizados.
          </p>
          <form action="/auth/salir" method="post">
            <button className="btn" type="submit">Salir</button>
          </form>
        </div>
      </div>
    );
  }
  return <Buscador datos={datos} email={user.email ?? ""} />;
}
