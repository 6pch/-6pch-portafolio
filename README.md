# Mi Portfolio — Next.js + Prisma + NextAuth

Portfolio personal con panel de administración privado, blog en Markdown,
comentarios, likes y analíticas de visitas propias. Todo hecho a mano,
sin servicios externos de pago.

## Qué incluye

- **Panel de administración** (`/admin`) protegido con login — CRUD de proyectos y posts sin tocar código.
- **Usuario admin autogenerado**: no hay que inventar ni hashear contraseñas a mano. Se crea solo, con una contraseña aleatoria segura, la primera vez que se instala o despliega.
- **Blog en Markdown** con vista previa en el editor.
- **Comentarios y likes** guardados en base de datos real (sin login necesario para el visitante), protegidos con límite de peticiones anti-spam.
- **Contador de visitas propio** — sin Google Analytics, con gráfico y mapa de calor tipo GitHub.
- **Modo oscuro/claro** con persistencia (`next-themes`).
- **Animaciones** con Framer Motion.
- **Seguridad**: validación estricta de datos con `zod`, rate limiting, cabeceras HTTP de seguridad, protección extra contra CSRF, hashing de contraseñas con bcrypt y sesiones cortas (12h).
- Listo para desplegar en **Vercel** (frontend + backend) con base de datos en **Railway** o **Neon**.

## 1. Instalación local

Necesitas [Node.js 18+](https://nodejs.org) instalado.

```bash
cd portfolio
npm install
cp .env.example .env
```

Edita `.env`: pon tu email en `ADMIN_EMAIL` y genera un secreto para NextAuth con:

```bash
openssl rand -base64 32
```

Pégalo en `NEXTAUTH_SECRET`.

### Crear la base de datos y tu usuario admin

Este único comando crea las tablas y genera tu usuario administrador:

```bash
npm run db:init
```

**Copia la contraseña que aparece en la terminal — solo se muestra esa vez.** Si la pierdes,
no pasa nada: puedes borrar la fila de `AdminUser` en la base de datos y volver a ejecutar
`npm run setup:admin` para que se genere una nueva.

(Opcional) Datos de ejemplo para probar cómo se ve el sitio con contenido:

```bash
npm run db:seed
```

### Arrancar en local

```bash
npm run dev
```

Abre `http://localhost:3000` — y `http://localhost:3000/admin` para el panel, con el email
que pusiste en `.env` y la contraseña que te mostró la terminal. En cuanto entres, ve a
**Ajustes** y cambia la contraseña por una que tú elijas.

## 2. Subir a GitHub

```bash
git init
git add .
git commit -m "feat: portfolio inicial con admin, blog, likes y analiticas"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

El archivo `.gitignore` ya excluye `node_modules`, `.env` y la base de datos local,
así que no subirás nada sensible por error.

## 3. Desplegar de verdad (Vercel + Postgres)

SQLite no funciona bien en Vercel (el sistema de archivos no es persistente), así que
para producción cambia a Postgres. Es un cambio de 2 líneas:

**a) Crea una base de datos Postgres gratis** en [Neon](https://neon.tech) o [Railway](https://railway.app).
Copia la cadena de conexión que te dan (empieza por `postgresql://...`).

**b) Edita `prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"   // antes decía "sqlite"
  url      = env("DATABASE_URL")
}
```

**c) Ve a [vercel.com](https://vercel.com), importa tu repo de GitHub**, y en
"Environment Variables" añade: `DATABASE_URL` (la de Postgres), `NEXTAUTH_SECRET`,
`NEXTAUTH_URL` (tu dominio real, ej. `https://tuportfolio.vercel.app`) y `ADMIN_EMAIL`.
No hace falta ninguna variable de contraseña: se genera sola en el build.

**d) Despliega.** El primer despliegue ejecutará `npm run build`, que sincroniza el
esquema de la base de datos y crea tu usuario admin automáticamente. **Revisa los
"Build Logs" de ese despliegue en Vercel** — ahí aparecerá tu contraseña generada,
una única vez. Cópiala antes de que el log se pierda de vista.

**e) Entra en `tu-dominio.vercel.app/admin/login`** con `ADMIN_EMAIL` y esa contraseña,
y cámbiala inmediatamente desde **Ajustes**. en Vercel → tu proyecto → Settings → Domains, añade tu dominio
y sigue las instrucciones de DNS. Actualiza `NEXTAUTH_URL` con el dominio final.

## Seguridad — qué protege este proyecto y por qué

- **Contraseñas nunca en texto plano**: se guardan con `bcrypt` (hash de un solo sentido, con "cost factor" 12).
- **Sesiones cortas** (12 horas) para el panel admin, en cookies `httpOnly` (JavaScript en el navegador no puede leerlas).
- **Rate limiting**: los endpoints públicos (login, comentarios, likes, visitas) limitan cuántas peticiones acepta una misma IP en un periodo de tiempo, para frenar spam y ataques de fuerza bruta.
- **Validación de datos con `zod`** en todas las rutas de la API: nada se guarda en la base de datos sin comprobar antes su forma y tamaño.
- **Protección CSRF en dos capas**: la cookie de sesión usa `SameSite=Lax`, y además las rutas que modifican datos comprueban la cabecera `Origin`.
- **Cabeceras HTTP de seguridad** (`next.config.js`): evitan clickjacking, MIME-sniffing y fugas de referrer innecesarias.
- **Sin XSS en comentarios/Markdown**: React escapa el texto por defecto y `react-markdown` no ejecuta HTML incrustado.

Esto no lo hace "inhackeable" (nada lo es), pero cubre los errores más comunes en proyectos pequeños.

## Estructura del proyecto

```
src/
  app/              rutas (páginas + API) con Next.js App Router
    admin/          panel privado (protegido por middleware.ts)
    api/            endpoints REST (proyectos, posts, likes, comentarios, visitas)
    blog/           blog público
  components/       componentes reutilizables de UI
  lib/              prisma, auth, utilidades
prisma/
  schema.prisma     modelos de la base de datos
  seed.ts           datos de ejemplo
```

## Ideas para seguir ampliándolo

- Subida de imágenes real para proyectos (Cloudinary o UploadThing, ambos con plan gratis).
- Paginación en el blog cuando tengas muchos posts.
- Newsletter simple (guardar emails en una tabla nueva).
- Etiquetas filtrables en los proyectos.

¡A programar! 🚀
