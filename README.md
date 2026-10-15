# MediAgenda

Sistema web para la gestión de citas médicas. Proyecto full-stack con backend Express + persistencia en JSON y frontend React + Vite.

---

## Requisitos previos

- **Node.js** 20.19+ o 22.12+ (requerido por Vite 8; se desarrolló con Node 26).
- **npm** 9 o superior.
- Windows, macOS o Linux.

---

## Estructura del proyecto

```
MediAgenda/
├── backend/        # API REST (Express)
│   ├── data/
│   │   └── citas.json
│   ├── index.js
│   └── package.json
├── frontend/       # SPA (React + Vite + React Router)
│   ├── src/
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Puertos utilizados

| Servicio  | Puerto | URL                       |
| --------- | ------ | ------------------------- |
| Backend   | 3001   | http://localhost:3001     |
| Frontend  | 5173   | http://localhost:5173     |

---

## Instalación

Clona el repositorio y entra a cada carpeta a instalar sus dependencias:

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal o después)
cd ../frontend
npm install
```

---

## Ejecución

Necesitas **dos terminales**, una por cada servicio.

### 1. Backend

```bash
cd backend
node index.js
```

Deberías ver:

```
MediAgenda backend escuchando en http://localhost:3001
```

Durante el desarrollo puedes usar `npm run dev`, que reinicia el servidor automáticamente al guardar cambios (`node --watch`).

### 2. Frontend

```bash
cd frontend
npm run dev
```

Vite abrirá la aplicación en `http://localhost:5173`.

> **Nota (Windows + PowerShell):** si `npm run dev` falla con un error de política de ejecución, abre PowerShell como administrador y ejecuta una sola vez:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
> Alternativa sin tocar políticas: usa `npm.cmd run dev`.

> **Nota (error "Cannot find native binding"):** si al ejecutar `npm run dev` aparece este error de `rolldown`, falta el binario nativo de tu sistema operativo. Instálalo sin modificar el `package-lock.json`, usando la misma versión de `rolldown` instalada (ejemplo para Windows x64):
> ```bash
> npm ls rolldown        # muestra la versión, p. ej. 1.2.13
> npm install --no-save @rolldown/binding-win32-x64-msvc@1.2.13
> ```

---

## API REST

Base URL: `http://localhost:3001`

### `GET /registros`

Devuelve la lista de citas almacenadas.

- **200 OK** — arreglo de citas (puede estar vacío).
- **500** — error leyendo el archivo.

**Respuesta de ejemplo:**
```json
[
  {
    "id": "9a48b088-7574-4f4b-aeb2-1239ddf8b0da",
    "solicitante": "Juan Pérez",
    "email": "juan@correo.com",
    "motivo": "Chequeo general",
    "fecha": "2026-10-20",
    "especialidad": "Medicina general",
    "createdAt": "2026-10-14T14:33:20.126Z"
  }
]
```

### `POST /registros`

Crea una nueva cita. Valida los datos y persiste en `backend/data/citas.json`.

- **201 Created** — cita creada; devuelve el objeto con su `id` (UUID) y `createdAt`.
- **400 Bad Request** — datos inválidos; devuelve `{ error, detalles: [...] }`.
- **500** — error de servidor.

**Campos requeridos:**

| Campo         | Tipo    | Validación                                                     |
| ------------- | ------- | -------------------------------------------------------------- |
| `solicitante` | string  | mínimo 2 caracteres                                            |
| `email`       | string  | formato de correo válido                                       |
| `motivo`      | string  | mínimo 3 caracteres                                            |
| `fecha`       | string  | formato `YYYY-MM-DD`, no puede ser en el pasado                |
| `especialidad`| string  | debe ser una de las especialidades permitidas (ver index.js)   |

**Ejemplo con `curl` (CMD de Windows):**
```cmd
curl -X POST http://localhost:3001/registros ^
  -H "Content-Type: application/json" ^
  -d "{\"solicitante\":\"Juan Perez\",\"email\":\"juan@correo.com\",\"motivo\":\"Chequeo\",\"fecha\":\"2026-11-01\",\"especialidad\":\"Medicina general\"}"
```

**Ejemplo con PowerShell:**
```powershell
$body = @{
  solicitante = "Juan Perez"
  email       = "juan@correo.com"
  motivo      = "Chequeo"
  fecha       = "2026-11-01"
  especialidad= "Medicina general"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/registros -Method Post `
  -ContentType "application/json" -Body $body
```

---

## Pruebas manuales recomendadas

1. **GET inicial vacío:** abre `http://localhost:3001/registros` en el navegador → debe mostrar `[]`.
2. **Formulario UI:**
   - Enviar vacío → aparecen mensajes de error por campo.
   - Email mal formado → error de formato.
   - Fecha anterior a hoy → error "no puede ser en el pasado".
   - Datos válidos → mensaje de éxito y redirección a `/lista`.
3. **Listado:** navega a `/lista` → aparecen las citas creadas; botón **Actualizar** vuelve a consultar la API.
4. **Resiliencia del backend:**
   - Borra `backend/data/citas.json` y haz un GET → el servidor lo recrea vacío.
   - Envía un JSON mal formado → responde `400` sin caerse.

---

## Pruebas automáticas del backend

```bash
cd backend
npm test
```

Levantan el servidor real en el puerto `3099` con una carpeta de datos temporal (no modifican `data/citas.json`) y verifican:

- Inicialización del archivo con una lista vacía.
- Creación con `201` e `id` único, y consulta con `200` sin perder registros anteriores.
- Rechazo con `400` de datos inválidos: email, nombre, especialidad, fecha pasada, fechas imposibles (p. ej. `2099-02-31`) y formato distinto a `YYYY-MM-DD`.
- Respuesta `400` ante JSON mal formado sin detener el servidor.
- Recuperación del servidor tras un error de escritura del archivo.
- Persistencia: los registros siguen disponibles después de reiniciar el backend.

El puerto y la carpeta de datos se pueden cambiar con las variables de entorno `PORT` y `DATA_DIR`.

---

## Rutas del frontend

| Ruta         | Pantalla                                        |
| ------------ | ----------------------------------------------- |
| `/`          | Bienvenida con resumen y accesos directos       |
| `/registro`  | Formulario de nueva cita con validaciones       |
| `/lista`     | Listado de citas obtenido vía `GET /registros`  |

---

## Notas técnicas

- La persistencia usa **`fs.promises`** con escritura atómica (archivo `.tmp` + `rename`) y un mutex en cadena para evitar corrupción por escrituras concurrentes.
- CORS está habilitado globalmente en el backend.
- El servidor incluye guardarraíles para `unhandledRejection` / `uncaughtException` y recrea el archivo de datos si falta o está corrupto.
