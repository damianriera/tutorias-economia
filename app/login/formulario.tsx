"use client";

import { useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";

export default function FormularioLogin({ errorInicial }: { errorInicial: string }) {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [msg, setMsg] = useState(errorInicial);
  const [ok, setOk] = useState("");
  const [enviando, setEnviando] = useState(false);

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
