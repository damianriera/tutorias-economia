"""Sube a Supabase los datos del buscador (reemplaza a construir.py).

Uso (desde la carpeta del repositorio):
  pip install openpyxl
  export SUPABASE_URL="https://xxxx.supabase.co"
  export SUPABASE_SERVICE_ROLE_KEY="..."      # clave secreta: no compartirla ni subirla
  python3 scripts/cargar_datos.py RUTA/relevamiento-actualizado.xlsx [RUTA/oficial-guarani.json]

Sin claves: agregar --sql para imprimir una sentencia SQL que se pega en
Supabase → SQL Editor (no guardar ni compartir el resultado: tiene datos personales).

Lee la planilla de respuestas del formulario y, si se indica, la historia
académica de SIU Guaraní, y guarda todo en la fila 'actual' de la tabla
datos_transicion. Los archivos con datos personales quedan en tu computadora o en la
carpeta compartida: no se copian al repositorio.
"""
import datetime
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

import openpyxl


def cell(v):
    if v is None:
        return ""
    if isinstance(v, datetime.datetime):
        return v.isoformat()
    if isinstance(v, float) and v.is_integer():
        return str(int(v))
    return str(v).strip()


def leer(xlsx):
    ws = openpyxl.load_workbook(xlsx, read_only=True).worksheets[0]
    filas = list(ws.iter_rows(values_only=True))
    head = [str(h or "").lower() for h in filas[0]]

    def col(*claves):
        for i, h in enumerate(head):
            if any(k in h for k in claves):
                return i
        raise SystemExit(f"Falta la columna {claves}")

    ix = dict(ts=col("marca temporal"), email=col("correo"), nombre=col("nombre"), dni=col("dni"),
              tel=col("teléfono", "telefono"), cambio=col("cambiarte"), ingreso=col("ingreso"))
    anios = [col(f"{n}° año") for n in range(1, 6)]
    rows = []
    for f in filas[1:]:
        if not any(f):
            continue
        f = tuple(f) + (None,) * (len(head) - len(f))
        r = {k: cell(f[i]) for k, i in ix.items()}
        r["y"] = [cell(f[i]) or None for i in anios]
        rows.append(r)
    return rows


def subir(url, clave, contenido):
    cuerpo = json.dumps({"id": "actual", "contenido": contenido,
                         "actualizado": datetime.datetime.now(datetime.timezone.utc).isoformat()},
                        ensure_ascii=False).encode()
    req = urllib.request.Request(
        url.rstrip("/") + "/rest/v1/datos_transicion?on_conflict=id",
        data=cuerpo, method="POST",
        headers={"apikey": clave, "Authorization": f"Bearer {clave}", "Content-Type": "application/json",
                 "Prefer": "resolution=merge-duplicates,return=minimal"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Supabase respondió {e.code}: {e.read().decode(errors='replace')}")


def como_sql(datos):
    js = json.dumps(datos, ensure_ascii=False, separators=(",", ":"))
    if "$datos$" in js:
        raise SystemExit("Los datos contienen el delimitador $datos$")
    return ("insert into public.datos_transicion (id, contenido, actualizado)\n"
            f"values ('actual', $datos${js}$datos$::jsonb, now())\n"
            "on conflict (id) do update set contenido = excluded.contenido, actualizado = now();\n")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    sql = "--sql" in sys.argv
    xlsx = Path(args[0])
    rows = leer(xlsx)
    datos = {"rows": rows, "source": f"{xlsx.name}, {datetime.date.today():%d/%m/%Y}"}
    if len(args) > 1:
        datos["oficial"] = json.loads(Path(args[1]).read_text(encoding="utf-8"))
        print(f"Datos oficiales: {len(datos['oficial']['alumnos'])} estudiantes", file=sys.stderr)
    if sql:
        sys.stdout.write(como_sql(datos))
        print(f"SQL generado con {len(rows)} respuestas.", file=sys.stderr)
        return
    url = os.environ.get("SUPABASE_URL")
    clave = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SECRET_KEY")
    if not url or not clave:
        raise SystemExit("Definí SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY, o usá --sql (ver README).")
    subir(url, clave, datos)
    print(f"Listo: {len(rows)} respuestas cargadas en Supabase.")


if __name__ == "__main__":
    main()
