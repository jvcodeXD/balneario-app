# Base Frontend Vue

Este proyecto es una base sólida para aplicaciones frontend modernas utilizando Vue 3 y Vuetify 3. Está diseñado para ser escalable, reutilizable y mantener buenas prácticas desde el inicio.

## 🚀 Tecnologías principales

- [Vue 3](https://vuejs.org/) con Composition API
- [Vuetify 3](https://vuetifyjs.com/) como framework UI
- [Pinia](https://pinia.vuejs.org/) para gestión de estado
- [Vue Router](https://router.vuejs.org/) para rutas dinámicas
- [Axios](https://axios-http.com/) para comunicación con APIs
- [Vue3 Toastify](https://vue3-toastify.js.org/) para notificaciones
- `vite` como herramienta de build rápida y moderna
- Tipado completo con TypeScript

## ✅ Funcionalidades actuales

- Sistema de autenticación con JWT (login, logout, manejo de roles)
- Rutas protegidas según el rol (`admin`, `user`, `público`)
- Layout dinámico con sidebar personalizado por tipo de usuario
- Cambio de tema claro/oscuro con persistencia
- Sistema global de notificaciones (`toast`) y confirmaciones (`useConfirmDialog`)
- Interceptores Axios con token y control de loading global
- CRUD de usuarios (con imagen, formulario, edición y eliminación)
- Carga de imágenes con vista previa
- Componentes desacoplados y organizados
- Reutilización de lógica con composables personalizados

## 📦 Instalación

1. Clona el repositorio

```bash
git clone https://github.com/jvcodeXD/base-frontend-vue.git
cd base-frontend-vue
```

2. Instala las dependencias

```bash
npm install
# o
yarn install
```

3. Configura tu entorno

Copia el archivo `.env.example` como `.env`:

```bash
cp .env.example .env
```

Y asegúrate de configurar la URL de tu API backend dentro del archivo:

```env
VITE_API_URL=http://localhost:4000/api
```

> 💡 **Nota para usuarios de Windows:** si no tienes el comando `cp`, puedes copiar manualmente el archivo `.env.example` y renombrarlo a `.env`.

4. Ejecuta en modo desarrollo

```bash
npm run dev
```

## 🗂 Estructura del proyecto

```
src/
├── assets/
├── components/
│   └── users/          # Tarjetas, formularios
├── composables/        # Hooks reutilizables como useToastNotify, useImageUpload
├── interfaces/         # Tipos TS
├── layouts/            # BaseLayout con router-view y sidebar
├── plugins/            # Vuetify, Axios
├── router/             # Rutas con guards por rol
├── services/           # Conexión a la API (auth, users, etc.)
├── store/              # Pinia: auth, theme, loading
├── views/              # Pantallas principales (Home, Login, Dashboard, Users)
```

## 🛣 Rutas y roles

| Ruta               | Acceso     |
| ------------------ | ---------- |
| `/`                | Público    |
| `/login`           | Público    |
| `/admin-dashboard` | Solo admin |
| `/user-dashboard`  | Solo user  |
| `/admin/usuarios`  | Solo admin |

## 🔐 Autenticación

- Usa JWT
- Los roles controlan el acceso a rutas y componentes
- Logout también hace petición al backend y limpia el estado

## 📸 Subida de imágenes

- Formulario con `v-file-input`
- Previsualización con `useImageUpload()`

## 🌈 Temas

- Claro / Oscuro con Vuetify
- Persistencia con Pinia
- Botón flotante superior derecho para alternar

## 📬 Notificaciones

- `useToastNotify()` para mostrar mensajes
- `useToastStore()` para guardar y mostrar después de navegación

## 📌 Confirmaciones

- Confirmación antes de eliminar usuario (`useConfirmDialog()`)

## 📅 Próximas mejoras (opcional)

- Validación de formularios con `yup` o `zod`
- Soporte para paginación y búsqueda en tablas
- Layouts con rutas anidadas (`/admin/*`, `/user/*`)
- Integración con módulo de refresco automático de token
- Soporte multilenguaje (i18n)

---

## 💻 Autor

**[jvcodeXD](https://github.com/jvcodeXD)**  
Proyecto base personal para futuros desarrollos en Vue 3.
