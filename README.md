# 🧪 OrangeHRM - Automatización E2E con Playwright (POM)

Proyecto de automatización de pruebas End-to-End para **OrangeHRM** usando **Playwright** con el patrón **Page Object Model (POM)** en JavaScript.

---

## 📁 Estructura del Proyecto

```markdown
orangehrm-playwright/
├── pages/                        # Page Objects (POM)
│   ├── BasePage.js               # Clase base con métodos comunes
│   ├── LoginPage.js              # Página de Login
│   ├── DashboardPage.js          # Dashboard + navegación
│   ├── PIMPage.js                # Módulo PIM (agregar empleados, foto)
│   └── DirectoryPage.js          # Módulo Directory (búsqueda y validación)
│
├── tests/
│   └── orangehrm-e2e.spec.js     # Suite de pruebas E2E
│
├── test-data/
│   ├── testData.js               # Datos de prueba centralizados
│   ├── generatePhoto.js          # Script para generar foto de prueba
│   └── profile-photo.png         # Foto de perfil (generar antes de ejecutar)
│
├── screenshots/                  # Capturas automáticas en fallos + manuales
├── reports/                      # Reportes HTML y JSON
└── playwright.config.js          # Configuración de Playwright
```

---

## 🚀 Instalación

```bash
# 1. Clonar el proyecto
git clone git@github.com:yaremislinktic/fwk-orangehrm-web-test.git

# 2. Instalar dependencias
npm install

# 3. Instalar navegadores de Playwright
npx playwright install
```

## ▶️ Ejecución de Pruebas

```bash
# Ejecutar todos los tests en modo headless (Cambiar previamente en el archivo playwright.config.js)
npm run test:headless

# Ejecutar todos los test con el navegador visible (headed)
npm run test:headed

# Ejecutar en modo debug (paso a paso)
npm run test:debug

# Abrir UI interactiva de Playwright
npm run test:ui

# Ver reporte HTML después de ejecutar
npm run test:report
```

---

## 🧪 Casos de Prueba

``` markdown
| ID    | Descripción                                              |
|-------|----------------------------------------------------------|
| TC-01 | Login exitoso con credenciales de administrador          |
| TC-02 | Agregar nuevo empleado con nombre y apellidos (PIM)      |
| TC-03 | Subir foto de perfil del empleado                        |
| TC-04 | Buscar empleado en Directory y validar información       |
| TC-05 | Flujo completo E2E encadenado (smoke test)               |
```

---

## 📸 Capturas de Pantalla

Las capturas se generan **automáticamente** en dos casos:

1. **Fallo de test** → guardadas en `screenshots/` (configurado en `playwright.config.js`)
2. **Manual** → usando `page.takeScreenshot('nombre')` en los Page Objects

---

## 📊 Reportes

Después de ejecutar los tests, se generan reportes en:

- **HTML interactivo**: `reports/html-report/index.html`
- **JSON**: `reports/test-results.json`

Para abrirlos:

```bash
npm run test:report
```

---

## ⚙️ Configuración Clave (`playwright.config.js`)

```js
screenshot: 'only-on-failure',   // Captura automática en fallos
video: 'on-first-retry',         // Video en reintentos
trace: 'on-first-retry',         // Trazas para debugging
headless: false,                 // Navegador visible (cambiar a true en CI)
timeout: 60000,                  // 60 segundos por test
```

---

## 🏗️ Patrón POM

``` markdown
Test (spec) ──► Page Object ──► Playwright API
    │                │
    │           • Locators
    │           • Métodos de acción
    │           • Métodos de verificación
    │
    └── BasePage (herencia común)
```

---

## 🔑 Credenciales de Prueba

Las credenciales se obtienen directamente de la página de OrangeHRM:

- **URL**: [https://opensource-demo.orangehrmlive.com/...](https://opensource-demo.orangehrmlive.com/...)

- **Usuario**: `Admin`
- **Contraseña**: `admin123`
