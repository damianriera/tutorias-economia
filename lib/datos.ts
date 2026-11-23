import "server-only";
import { crearClienteServidor } from "./supabase/server";

export type Datos = {
  rows: Record<string, unknown>[];
  source: string;
  oficial?: { fecha?: string; alumnos: Record<string, unknown> } | null;
};

/** Lee el conjunto de datos vigente. Corre solo en el servidor y con la sesión
 *  del usuario: si su correo no está en la tabla `autorizados`, RLS no devuelve nada. */
export async function leerDatos(): Promise<{ datos: Datos | null; error?: string }> {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("datos_transicion")
    .select("contenido, actualizado")
    .eq("id", "actual")
    .maybeSingle();
  if (error) return { datos: null, error: error.message };
  if (!data) return { datos: null };
  return { datos: data.contenido as Datos };
}
