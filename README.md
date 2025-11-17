# OrderingService

Proyecto de ejemplo (Clean Architecture) — instrucciones rápidas para arrancar, compilar y ejecutar tests.

## Requisitos

- Node.js (versión LTS recomendada) y npm instalados.

## Instalar dependencias

En la raíz del proyecto ejecuta:

```powershell
npm install
```

## Scripts útiles

- `npm run dev` — arranca la aplicación en modo desarrollo usando `tsx` (ejecuta `main.ts` directamente).
- `npm run build` — compila TypeScript en `./dist`.
- `npm run start` — ejecuta la versión compilada (`node ./dist/main.js`).
- `npm run test` — ejecuta los tests con Vitest.
- `npm run test:watch` — ejecuta Vitest en modo watch.

## Cómo arrancar (desarrollo)

```powershell
# instalar deps si no lo hiciste
npm install
# arrancar en dev (usa tsx)
npm run dev
```

La aplicación escucha por defecto en el puerto `3000` (puedes cambiarlo con la variable de entorno `PORT`).

## Cómo compilar y arrancar en producción

```powershell
npm run build
npm run start
```

## Tests

```powershell
npm run test
```

## Notas de desarrollo

- Se usan alias de TypeScript (definidos en `tsconfig.json`) como `@infrastructure`, `@application`, `@domain`, `@shared` y `@composition`.
- Si tu editor no resuelve los imports por alias, asegúrate de que use la configuración de `tsconfig.json` o instala la extensión que lo soporte.
- El servidor HTTP está en `src/infrastructure/http/server.ts` y el controlador de órdenes en `src/infrastructure/http/OrdersController.ts`.

## Contribuciones

Abre un issue o PR. Gracias por colaborar.