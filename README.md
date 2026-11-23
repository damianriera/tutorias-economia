# Tutorías de transición · Lic. en Economía (UNViMe)

Buscador por DNI para planificar la transición de estudiantes al plan 2027:
aprobadas por año, faltantes en plan 2014 y plan 2027, equivalencias totales y
parciales (coloquios), resumen general y revisión de datos.

Aplicación **Next.js** pensada para **Vercel** (plan Hobby, gratis) con
**Supabase** (plan Free) para el inicio de sesión y para guardar los datos.

## Cómo se protegen los datos

- Cada tutor/a entra con **su propio correo y contraseña** (Supabase Auth). Se
  puede dar de baja a una persona sin cambiarle la clave a nadie más.
- Los datos de estudiantes **no están en el repositorio ni en el sitio publicado**.
  Viven en una tabla de Supabase y el servidor los entrega solo después de
  verificar la sesión.
- Además de tener cuenta, el correo tiene que estar en la tabla `autorizados`
  (política RLS en la base). Una cuenta sin autorización ve "Sin datos para mostrar".
- La carga de datos usa la clave secreta de Supabase, que queda solo en la
  computadora de quien carga. El sitio usa la clave pública, que no da acceso a nada
  sin una sesión autorizada.

## Puesta en marcha (una sola vez)

### 1. Supabase
1. Crear cuenta en https://supabase.com y un proyecto nuevo (plan Free, región São Paulo).
2. **SQL Editor** → pegar el contenido de [`supabase/esquema.sql`](supabase/esquema.sql) → *Run*.
3. **Authentication → Sign In / Providers → Email**: desactivar **"Allow new users to sign up"**
   (así solo existen las cuentas que crea la coordinación).
4. **Authentication → URL Configuration**: en *Site URL* poner la dirección de Vercel
   (p. ej. `https://tutorias-economia.vercel.app`) y en *Redirect URLs* agregar
   `https://tutorias-economia.vercel.app/auth/callback` (sirve para "Olvidé mi contraseña").
5. **Authentication → Emails → Templates**: en *Invite user* y en *Reset password*,
   cambiar el enlace del mensaje por (respectivamente):
   - `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/cuenta`
   - `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/cuenta`
6. Por cada tutor/a:
   - **Table Editor → autorizados → Insert row**: su correo en minúsculas.
   - **Authentication → Users → Add user → Send invitation**: le llega un correo, entra
     y elige su contraseña en *Mi cuenta*. (También se puede usar *Create new user* con
     una contraseña inicial y *Auto Confirm User*.)
7. **Project Settings → API**: copiar *Project URL*, la clave pública
   (*publishable* o *anon*) y la clave secreta (*secret* o *service_role*; no compartirla).

### 2. Cargar los datos
Opción A, sin claves: `python3 scripts/cargar_datos.py PLANILLA.xlsx GUARANI.json --sql > carga.sql`
y pegar `carga.sql` en **SQL Editor** → *Run*. Borrar `carga.sql` después (tiene datos personales).

Opción B, directo a la API, en la computadora donde están la planilla y el JSON de Guaraní:

```bash
pip install openpyxl
export SUPABASE_URL="https://xxxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="(clave secreta)"
python3 scripts/cargar_datos.py datos/relevamiento-actualizado.xlsx datos/oficial-guarani.json
```

Repetirlo cada vez que cambie la planilla o se releve Guaraní: reemplaza los
datos anteriores y el sitio los muestra al instante, sin volver a desplegar.

### 3. Vercel
1. Crear cuenta en https://vercel.com con GitHub → **Add New → Project** → importar `tutorias-economia`.
2. En **Environment Variables** cargar (ver [`.env.example`](.env.example)):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (la clave pública)
   - `CRON_SECRET` (opcional: texto largo al azar)
   Con la integración de Supabase del Marketplace de Vercel las dos primeras se cargan solas.
3. **Deploy**. La dirección queda en *Settings → Domains*; usarla en el paso 1.4 de Supabase.

`vercel.json` programa una llamada diaria a `/api/keepalive` para que Supabase
no pause el proyecto gratuito por falta de uso (lo pausa tras 7 días sin actividad).

### 4. Apagar el sitio anterior
Cuando el nuevo sitio funcione: GitHub → *Settings → Pages* → desactivar.

## Desarrollo local

```bash
cp .env.example .env.local   # completar
npm install
npm run dev                  # http://localhost:3000
```

## Estructura

- `lib/buscador.js`: planes 2014 y 2027, correlatividades, matriz de equivalencias
  y toda la lógica de la ficha (migrada del HTML anterior). Los criterios ambiguos
  de la matriz se configuran en la pestaña **Criterios**.
- `lib/markup.js`: estructura HTML de las pestañas.
- `app/`: páginas (`/` buscador, `/login`, `/cuenta`) y rutas de autenticación.
- `proxy.ts`: renueva la sesión y manda a `/login` a quien no la tiene.
- `supabase/esquema.sql`: tablas y políticas de acceso.
- `scripts/cargar_datos.py`: sube la planilla y los datos de Guaraní a Supabase.
