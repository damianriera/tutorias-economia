"use client";

import { useEffect, useRef } from "react";
import { MARKUP } from "@/lib/markup";
import { iniciar } from "@/lib/buscador";
import type { Datos } from "@/lib/datos";

// Monta la interfaz original del buscador (pestañas, ficha, resumen, revisión
// y criterios) con los datos que entregó el servidor a este usuario.
export default function Buscador({ datos, email }: { datos: Datos; email: string }) {
  const montado = useRef(false);
  useEffect(() => {
    if (montado.current) return;
    montado.current = true;
    const span = document.getElementById("userEmail");
    if (span) span.textContent = email;
    iniciar(datos);
  }, [datos, email]);
  return <div id="appView" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
