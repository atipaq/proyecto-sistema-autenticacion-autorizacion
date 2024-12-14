# Sistema de Autenticación y Autorización con OAuth y JWT

Este proyecto es un sistema de autenticación y autorización desarrollado con **Node.js**, **Express.js**, y **MongoDB Atlas**, que utiliza **JWT** para autenticación y **OAuth 2.0** para autorización.

---

## Características

- Autenticación con JSON Web Tokens (JWT).
- Renovación de tokens mediante `refreshToken`.
- Gestión de roles y permisos para autorización basada en privilegios.
- Implementación del flujo OAuth 2.0 para delegación de acceso.
- Conexión a base de datos en la nube utilizando MongoDB Atlas.
- Arquitectura modular con modelos, rutas, middlewares y controladores.

---

## Tecnologías Utilizadas

- **Node.js**: Plataforma para la ejecución del servidor backend.
- **Express.js**: Framework para manejar rutas y middlewares.
- **MongoDB Atlas**: Base de datos en la nube para alta disponibilidad y escalabilidad.
- **JWT**: Generación y validación de tokens de acceso.
- **OAuth 2.0**: Protocolo para autorización segura.
- **bcryptjs**: Para encriptar contraseñas de forma segura.
- **dotenv**: Gestión de variables de entorno.

---

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente:

### 1. Clona este repositorio

```bash
git clone https://github.com/tu-usuario/nombre-del-repositorio.git
cd nombre-del-repositorio
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
PORT=3000
MONGO_URL=tu-url-de-mongodb-atlas
JWT_SECRET=tu-secreto-jwt
```

### 4. Ejecuta el servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`.

---

## Estructura del Proyecto

```bash
.
├── controllers/        # Controladores con la lógica del negocio
│   ├── authController.js
│   ├── oauthController.js
├── middlewares/        # Middlewares para autenticación y autorización
│   ├── authMiddleware.js
├── models/             # Modelos de datos para MongoDB
│   ├── userModel.js
│   ├── authorizationCodeModel.js
├── routes/             # Definición de rutas de la API
│   ├── authRoutes.js
│   ├── oauthRoutes.js
├── db.js               # Conexión a MongoDB Atlas
├── app.js              # Configuración principal del servidor
├── .env                # Variables de entorno
└── package.json        # Configuración del proyecto
```

---

## Endpoints Principales

### Autenticación

- `POST /auth/register`: Registro de usuarios.
- `POST /auth/login`: Inicio de sesión y generación de tokens.
- `POST /auth/refresh`: Renovar el `accessToken` con un `refreshToken`.
- `POST /auth/logout`: Cerrar sesión y revocar el `refreshToken`.

### Autorización

- `GET /oauth/authorize`: Generar un código de autorización.
- `POST /oauth/token`: Intercambiar un código de autorización por tokens.

### Rutas Protegidas

- `GET /protected`: Ruta protegida que requiere un accessToken.
- `GET /admin`: Ruta protegida para administradores.
- `GET /view-reports`: Ruta basada en permisos específicos.
