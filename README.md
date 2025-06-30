# AppWeb Gestion Sushi
Proyecto de Gestión de Pedidos y Reservas de una web de restaurante desde el punto de vista del cliente

---

## 1. Estructura del Proyecto

```
AppWeb-Gestion-Sushi/
│
├── backend/                # Node.js + Express + Sequelize
│   ├── app.js              # Lógica principal del backend y modelos
│   ├── .env                # Variables de entorno
│   ├── package.json        # Dependencias backend
│   └── ...otros archivos
│
├── frontend/               # Vanilla JS + HTML + CSS
│   ├── index.html
│   ├── index.js
│   ├── styles.css
│   ├── blocks/             # Componentes reutilizables (Web Components)
│   └── ...otros archivos
│
├── schema_design/
│   ├── database.sql        # Esquema de la base de datos (PostgreSQL)
│   └── data.sql            # Datos de ejemplo
│
└── README.md
```

## 2. Patrones de Diseño Implementados

### a) Singleton (Router y Servicios)

- **Patrón:** Singleton
- **Justificación:** Asegura que solo exista una instancia de clases críticas como el Router y servicios como AuthService, proporcionando un punto de acceso global a estas instancias.
- **Implementación:**
  ```javascript
  class RouterService {
    static getInstance() {
      if (!RouterService.instance) {
        RouterService.instance = new RouterService();
      }
      return RouterService.instance;
    }
  }
  ```
- **Ubicación:** `frontend/services/router.js`, `frontend/services/auth.service.js`

### b) Observer (Eventos Personalizados)

- **Patrón:** Observer
- **Justificación:** Permite la comunicación desacoplada entre componentes a través de eventos personalizados.
- **Implementación:**
  ```javascript
  // Publicar evento
  window.dispatchEvent(new CustomEvent('auth-change'));
  
  // Suscribirse a evento
  window.addEventListener('auth-change', this.handleAuthChange);
  ```
- **Ubicación:** Múltiples componentes que necesitan reaccionar a cambios de autenticación o ruta.

### c) Factory (Componentes UI)

- **Patrón:** Factory
- **Justificación:** Simplifica la creación de componentes UI consistentes a través de funciones factoría.
- **Implementación:**
  ```javascript
  function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  }
  ```
- **Ubicación:** Componentes reutilizables en `frontend/blocks/`

### d) Web Components (Frontend)

- **Patrón:** Web Component (Custom Elements)
- **Justificación:** Permite encapsular y reutilizar componentes UI como la reserva, carrito, navbar, etc., facilitando el mantenimiento y escalabilidad.
- **Archivo:** `frontend/blocks/reservation/reservation.js` (ejemplo)
- **Pseudocódigo:**
  ```pseudo
  class Reservation extends HTMLElement:
      constructor():
          attachShadow()
          crearTemplateHTML()
          this.shadowRoot.appendChild(template)
      connectedCallback():
          agregarListeners()
      handleSubmit(event):
          prevenirDefault()
          leerCampos()
          mostrarAlerta()
  customElements.define('reservation-component', Reservation)
  ```

### e) ORM y DRY (Backend)

- **Patrón:** DRY (Don't Repeat Yourself) + ORM (Object-Relational Mapping)
- **Justificación:** Se usan funciones genéricas para CRUD sobre modelos Sequelize, evitando duplicación de lógica y facilitando el mantenimiento.
- **Archivo:** `backend/app.js`
- **Pseudocódigo:**
  ```pseudo
  function getAll(model):
      return async (req, res) => model.findAll()

  function getById(model):
      return async (req, res) => model.findByPk(req.params.id)

  function createRecord(model):
      return async (req, res) => model.create(req.body)
  ```
  Estas funciones se usan en los endpoints para todos los modelos (usuarios, platos, reservas, blogs, órdenes).

## 3. Diagrama de la Base de Datos

La base de datos está documentada en `schema_design/database.sql`. Esquema relacional principal:

- **users** (id, name, phone_number, email, password, address, created_at)
- **dishes** (id, name, description, price, image_url, category)
- **reservations** (id, name, phone_number, email, number_of_guests, reservation_date, reservation_time, created_at)
- **blogs** (id, title, image_url, description, content, author, publication_date)
- **user_favorite_blogs** (user_id, blog_id, favorited_at) [relación N:M]
- **orders** (id, user_id, total_amount, order_date, status)
- **order_items** (id, order_id, dish_id, quantity, unit_price)

Puedes visualizar el diagrama con herramientas como dbdiagram.io usando el SQL de `database.sql`.

## 4. Documentación del Proyecto

- **Frontend:** Vanilla JS, HTML5, CSS3, Web Components. Cada bloque en `blocks/` es un componente independiente (ej: `reservation`, `cart`, `navbar`).
- **Backend:** Node.js, Express, Sequelize (PostgreSQL), API RESTful. Modelos y endpoints CRUD para usuarios, platos, reservas, blogs, órdenes.
- **Base de datos:** PostgreSQL, diseño relacional, relaciones N:M y claves foráneas.

## 5. Pasos para Ejecutar el Proyecto

### Backend

1. Instala dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Configura el archivo `.env` con la URL de tu base de datos PostgreSQL.
3. Ejecuta las migraciones/manualmente el SQL de `schema_design/database.sql` en tu PostgreSQL.
4. Inicia el servidor:
   ```bash
   node app.js
   ```
   El backend corre por defecto en `http://localhost:3000`.

### Frontend

1. Abre `frontend/index.html` en tu navegador.
2. Asegúrate de que el backend esté corriendo para que los formularios y peticiones funcionen.

---

https://www.figma.com/design/X53GqUwCgv3BxxHMaGVl2t/web-app-exam-1?node-id=0-1&t=EhoytveOchmN4lbw-1