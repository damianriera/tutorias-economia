import { supabaseConfigurado } from "@/lib/supabase/config";
import FormularioLogin from "./formulario";

export const dynamic = "force-dynamic";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="wrap">
      <div className="lock card">
        <h2>Tutorías de transición · Lic. en Economía</h2>
        <p className="muted small">
          Ingresá con la cuenta que te dio la coordinación de carrera. Los datos de estudiantes se leen desde el
          servidor solo para cuentas autorizadas.
        </p>
        {supabaseConfigurado() ? (
          <FormularioLogin errorInicial={error === "enlace" ? "El enlace venció o ya se usó. Pedí uno nuevo." : ""} />
        ) : (
          <p className="err">Falta configurar Supabase (variables NEXT_PUBLIC_SUPABASE_URL y clave pública).</p>
        )}
      </div>
    </div>
  );
}
