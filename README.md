# CyberNet

Sistema web para administrar un cibercafé. La Entrega 3 usa Express y MongoDB.

## Arranque local

Necesitas Node.js 22 o superior y MongoDB corriendo en el puerto local 27017.

Desde la raíz del proyecto, abre PowerShell e instala las dependencias:

```powershell
Set-Location backend
npm ci
```

Si es tu primera vez y todavía no tienes un `.env`, crea uno desde la plantilla:

```powershell
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

En `.env`, pon una contraseña local de al menos 12 caracteres en `ADMIN_CONTRASENA`
y pega el valor generado en `JWT_SECRET`. `ADMIN_CORREO` indica el correo con el
que iniciarás sesión.

Desde `backend`, crea el administrador y los equipos de prueba, y arranca el servidor:

```powershell
node --env-file=.env src/crear-admin.js
node --env-file=.env src/cargar-equipos-prueba.js
node --env-file=.env src/server.js
```

Abre [CyberNet](http://127.0.0.1:3000) e inicia sesión con tu correo y contraseña.
Puedes verificar la conexión a MongoDB en [API Health](http://127.0.0.1:3000/api/health).

## Prueba rápida

Registra un cliente, inicia una sesión en un equipo disponible y comprueba que
aparezca ocupado en el mapa. Finaliza la sesión con $500 de extras y verifica
que el total los incluya y que el equipo vuelva a estar disponible.