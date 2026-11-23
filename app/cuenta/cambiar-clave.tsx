"use client";

import { useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/client";

export default function CambiarClave() {
  const [clave, setClave] = useState("");
  const [repetir, setRepetir] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState("");

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setOk("");
    if (clave.length < 10) return setMsg("Usá al menos 10 caracteres.");
    if (clave !== repetir) return setMsg("Las contraseñas no coinciden.");
    const { error } = await crearClienteNavegador().auth.updateUser({ password: clave });
    if (error) return setMsg(error.message);
    setClave("");
    setRepetir("");
    setOk("Contraseña actualizada.");
  }

  return (
    <form onSubmit={guardar}>
      <label htmlFor="nueva">Contraseña nueva</label>
      <input id="nueva" type="password" autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} />
      <label htmlFor="repetir">Repetila</label>
      <input id="repetir" type="password" autoComplete="new-password" value={repetir} onChange={(e) => setRepetir(e.target.value)} />
      <button className="btn primary" type="submit">Guardar</button>
      <div className="err" role="alert">{msg}</div>
      {ok && <p className="small" style={{ color: "var(--ok)" }}>{ok}</p>}
    </form>
  );
}
