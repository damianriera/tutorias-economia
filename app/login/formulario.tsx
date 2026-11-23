"use client";

import { useEffect, useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";

export default function FormularioLogin({ errorInicial }: { errorInicial: string }) {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [msg, setMsg] = useState(errorInicial);
  const [ok, setOk] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Enlaces de invitación o recuperación con las plantillas de correo por defecto
  // de Supabase: llegan con la sesión en el fragmento (#access_token=...).
  useEffect(() => {
    const h = new URLSearchParams(window.location.hash.slice(1));
    const access_token = h.get("access_token");
    const refresh_token = h.get("refresh_token");
    if (h.get("error_description")) setMsg(h.get("error_description") ?? "");
    if (!access_token || !refresh_token) return;
    setOk("Validando el enlace…");
    crearClienteNavegador()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setOk("");
          setMsg("El enlace venció o ya se usó. Pedí uno nuevo.");
          return;
        }
        const tipo = h.get("type");
        window.location.replace(tipo === "invite" || tipo === "recovery" ? "/cuenta" : "/");
      });
  }, []);

  async function ingresar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMsg("");
    setOk("");
    const { error } = await crearClienteNavegador().auth.signInWithPassword({ email, password: clave });
    if (error) {
      setMsg(error.message === "Invalid login credentials" ? "Correo o contraseña incorrectos." : error.message);
      setEnviando(false);
      return;
    }
    window.location.assign("/");
  }

  async function recuperar() {
    setMsg("");
    setOk("");
    if (!email) {
      setMsg("Escribí tu correo para enviarte el enlace.");
      return;
    }
    const { error } = await crearClienteNavegador().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/cuenta`,
    });
    if (error) setMsg(error.message);
    else setOk("Si el correo está registrado, te llegó un enlace para elegir una contraseña nueva.");
  }

  return (
    <form onSubmit={ingresar}>
      <label htmlFor="email">Correo</label>
      <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="clave">Contraseña</label>
      <input id="clave" type="password" autoComplete="current-password" required value={clave} onChange={(e) => setClave(e.target.value)} />
      <button className="btn primary" type="submit" disabled={enviando}>
        {enviando ? "Ingresando…" : "Ingresar"}
      </button>
      <button className="btn" type="button" onClick={recuperar} style={{ marginLeft: 8 }}>
        Olvidé mi contraseña
      </button>
      <div className="err" role="alert">{msg}</div>
      {ok && <p className="small" style={{ color: "var(--ok)" }}>{ok}</p>}
    </form>
  );
}
