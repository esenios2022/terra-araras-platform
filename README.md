# Terra Araras

Plataforma de meditaciones y limpiezas energéticas guiadas en video y audio, con
suscripción mensual. Antes de entrar a la biblioteca, un agente de IA conversa
brevemente con cada persona para entender qué la trae.

Stack: Next.js (App Router) + Neon (Postgres) + login propio (cookies firmadas) +
Cloudflare R2 (audios privados) + Vimeo (video privado) + Claude (agente de
intake) + Stripe y Mercado Pago (suscripciones). Pensado para desplegar en
Vercel.

## Puesta en marcha

### 1. Neon (base de datos)

1. Creá una cuenta y un proyecto en [neon.tech](https://neon.tech) (plan free).
2. En el **SQL Editor** del proyecto, ejecutá el contenido de
   [db/schema.sql](db/schema.sql). Esto crea las tablas `users`,
   `content_items`, `intake_sessions` y `subscriptions`.
3. Copiá el **Connection string** (pooled connection) — es el valor de
   `DATABASE_URL`.
4. Para convertir tu propio usuario en admin: registrate normalmente desde
   `/signup` y después, en el SQL Editor, corré:
   ```sql
   update users set role = 'admin' where email = 'tu-email@ejemplo.com';
   ```

### 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

- `DATABASE_URL` → connection string de Neon.
- `SESSION_SECRET` → una cadena larga y aleatoria (ej: `openssl rand -hex 32`).
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
  → de tu cuenta de Cloudflare (ver paso 4).
- `ANTHROPIC_API_KEY` → para el agente de intake conversacional.
- `VIMEO_ACCESS_TOKEN` → de tu cuenta Vimeo Pro/Business.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY` → de tu cuenta Stripe.
- `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`,
  `MERCADOPAGO_MONTHLY_AMOUNT` → de tu cuenta Mercado Pago.

### 3. Videos (Vimeo)

1. Subí cada video a Vimeo y, en su configuración de privacidad, restringí la
   reproducción solo a tu dominio (evita que se incruste en otros sitios) y
   desactivá la descarga.
2. En el panel de admin (`/admin/content/new`) creá el contenido tipo "Video"
   pegando el **ID numérico** del video de Vimeo.

Importante: no existe protección 100% infalible contra grabación de pantalla.
Esta configuración evita la descarga y el reuso del link fuera del dominio, que
es lo que cubre la gran mayoría de los casos.

### 4. Audios (Cloudflare R2)

1. Creá una cuenta gratis en [cloudflare.com](https://cloudflare.com).
2. En el dashboard, entrá a **R2 Object Storage** → "Create bucket" (nombre
   libre, ej: `terra-araras-audio`). El free tier incluye 10 GB de
   almacenamiento sin costo de salida.
3. En **R2 → Manage API tokens**, creá un token con permiso de
   lectura/escritura sobre ese bucket. Te da `Account ID`, `Access Key ID` y
   `Secret Access Key`.
4. Los audios se suben directo desde `/admin/content/new` (tipo "Audio") y se
   reproducen con una URL firmada que vence en 60 segundos, generada en cada
   reproducción.

### 5. Pagos

- **Stripe**: creá un producto con precio recurrente mensual y poné su ID en
  `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY`. Configurá un webhook hacia
  `/api/webhooks/stripe` escuchando `checkout.session.completed`,
  `customer.subscription.updated` y `customer.subscription.deleted`.
- **Mercado Pago**: configurá una notificación webhook hacia
  `/api/webhooks/mercadopago` para eventos de tipo `subscription_preapproval`.

### 6. Deploy en Vercel

1. En [vercel.com](https://vercel.com), importá este repositorio de GitHub.
2. Agregá las mismas variables de entorno del paso 2 (con los valores reales).
3. Deploy. Cada push a `main` se publica automáticamente.

## Desarrollo local

```bash
npm install
npm run dev
```

## Roles

- **user**: se registra, paga la suscripción y accede a la biblioteca según su
  estado de pago.
- **admin**: además accede a `/admin` para subir/editar/publicar contenido y
  ver el listado de suscriptores. Se asigna manualmente en la base (ver paso 1).

## Seguridad de la sesión

El login es propio: las contraseñas se guardan con hash (bcrypt) y la sesión
viaja en una cookie firmada (JWT, `SESSION_SECRET`) con httpOnly + secure en
producción. No hay recuperación de contraseña por email todavía — si la
agregás más adelante, vas a necesitar un proveedor de envío de emails (ej.
Resend).
