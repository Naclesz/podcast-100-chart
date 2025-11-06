# 🎧 Podcast 100 chart

Aplicación en **React + TypeScript** que muestra los podcasts más escuchados, sus detalles y episodios.  
La aplicación aplica principios **SOLID** para mantener el código claro, extensible y fácil de testear.

Está compuesta por tres pantallas principales:

- Home `/` Lista los 100 podcast más escuchados:
  - Grid que representa los 100 podcasts más escuchado
  - Card que presenta imagen, nombre y autor de cada podcast. La card es accionable
  - Permite filtrar podcast por busqueda en base al nombre y al autor
  - El listado se almacena en cliente (Context API) y se renueva cada 24 horas
- Podcast `/podcast/:podcastId:` Detalle de un podcast:
  - Vista de dos columnas
  - Columna izquierda muestra info extendida del podcast seleccionado: imagen, nombre, autor y descripcción
  - Columna derecha muestra listado de episodios que componen el podcast
    - Header con contados de episodios
    - Por cada episodio se muestra un item con el nombre del episodio, la fecha y la duración. El nombre es accionable
  - El detalle del podcast se almacena en cliente (Context API) y se renueva cada 24 horas
- Episodio `/podcast/:podcastId:/episode/:episodeId:` Detalle de un episodio:
  - Vista de dos columnas
  - Columna izquierda muestra info extendida del podcast seleccionado: imagen, nombre, autor y descripción. La imagen y el título son accionables y vuelven a la vista anterior
  - Columna derecha muestra información del episodio
    - Nombre
    - Descripción
    - Reproductor de audio

Estas tres pantallas hacen uso de un layout compuesto por un header y un contenedor. En el header se muestra el nombre de la aplicación, que es accionable y redirige a la vista de home y un indicador que refleja un cambio en la navegación.

## 🌐 Demo en Vivo

La aplicación está desplegada y disponible en: **https://podcast100chart.netlify.app/**

### 📊 Análisis de Rendimiento

Puedes consultar las métricas de rendimiento y accesibilidad en PageSpeed Insights: **[Ver análisis completo](https://pagespeed.web.dev/analysis/https-podcast100chart-netlify-app/bizuordxb5?form_factor=mobile)**

---

## 🚀 Cómo Ejecutar la Aplicación

### Instalación de dependencias

```bash
npm install
```

### 🔧 Modo Development

Ejecuta la aplicación en modo desarrollo con hot-reload:

```bash
npm run dev
```

**Características del modo development:**

- ✅ Assets servidos **sin minimizar** para facilitar debugging
- ✅ Hot Module Replacement (HMR) - cambios instantáneos sin recargar
- ✅ Source maps completos
- 🌐 Disponible en: `http://localhost:5173`

### 🚀 Modo Production

Genera el build optimizado para producción:

```bash
npm run build
```

**Características del build de producción:**

- ✅ Assets **concatenados y minimizados** para máximo rendimiento
- ✅ Code splitting automático
- ✅ Optimización de imágenes y recursos
- ✅ Hash en nombres de archivos para cache busting
- 📦 Salida generada en: `/dist`

**Preview del build de producción:**

```bash
npm run preview
```

Esto sirve el build de producción localmente para verificar que todo funciona correctamente antes del despliegue.

---

## 📋 Roadmap

El desarrollo del proyecto sigue un roadmap estructurado en fases. Puedes consultar el progreso actual y las próximas funcionalidades en [docs/roadmap.md](docs/roadmap.md).

---

## 📦 Stack Tecnológico

### Frontend

- **React 19 + Vite**
- **TypeScript**
- **React Router**
- **React Context + Hooks personalizados**
- **ESLint**
- **Prettier**
- **SASS**

## 🛠️ Decisiones de Tecnología y Diseño

- **Atomic Design Pattern para componentes React**  
  La UI se estructura en átomos, moléculas, organismos, plantillas y páginas. Fomenta la **reutilización** y una **jerarquía clara** en los componentes, lo que facilita el mantenimiento y la extensión de la interfaz.

- **Nomenclatura BEM para clases CSS**  
  Se sigue la convención Block–Element–Modifier en los estilos. Mejora la **legibilidad del CSS** y permite escalar los estilos de forma consistente en un equipo.

- **Imports con rutas absolutas**  
  Se configuran imports absolutos usando `tsconfig.json` (ejemplo: `import { PodcastCard } from "components/PodcastCard";`).

- **Uso de SCSS en lugar de CSS plano**  
  Se utiliza SCSS como preprocesador de estilos en lugar de CSS nativo. Uso de variable para colores, tipografias, etc y anidamiento de selectors que hace los estilos más legibles

- **Componentes alineados con los estándares de accesibilidad WCAG**
  Uso de elementos interactivos, keyboard listeners, etc

- **Navegación con createBrowserRouter**  
  API moderna de React Router que ofrece mejor rendimiento, mejoras en debugging y posibilidad de incluir funcionalidades avanzadas, como el uso de errorElement para manejo controlado de errores de ejecución.

- **Vite server proxy**
  Para poder acceder a recursos externos que no proveen JSONP ni cabeceras CORS se ha hecho uso del proxy que permite configurar la build tool Vite

- **Husky + lint-staged con pre-commit**
  Bloquea los commit que tenga errores o warnings den Typescript indicados en las reglas establecidas en ESLint

- **Manejo de errores con React Router errorElement**  
  Se implementa una UI de error elegante usando la propiedad `errorElement` de React Router que captura errores durante el renderizado de componentes. Proporciona una experiencia de usuario mejorada con mensajes informativos y acciones de recuperación cuando ocurren fallos inesperados.

### Testing

- **Vitest** - Test runner rápido y moderno para Vite
- **React Testing Library** - Testing de componentes React
- **@testing-library/jest-dom** - Matchers adicionales para assertions
- **jsdom** - Simulación del DOM para tests

#### 🧪 Comandos de Testing

```bash
# Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
npm test

# Abrir UI interactiva de Vitest en el navegador
npm run test:ui

# Generar reporte de cobertura de código
npm run test:coverage
```

---

## 📂 Estructura de directorios

- **services/** Contiene la lógica de acceso a datos y reglas de negocio.
- **context/** Define dependencias globales con React Context.
- **hooks/** Encapsulan lógica reutilizable de React (datos + estado).
- **components/** Componentes de UI reutilizables y presentacionales.
- **pages/** Vistas principales que representan rutas de la aplicación.
- **router/** Configuración de navegación con React Router.
- **styles/** Con ficheros parciales para variables, mixins, placeholders y estilos globales.

## 🎯 Principios SOLID Aplicados

- **Single responsability:**

  - `api.config.ts` solo contiene configuración de endpoints
  - `api.client.ts` solo construye un cliente http genérico
  - `podcast.service.ts` solo gestiona la lógica de podcasts

- **Open/Closed:**

  - Facilidad para agregar nuevo endpoints sin tener que hacer modificaciones en el código existente
  - El cliente http genérico se puede extender para dar soporte a otro tipo de servicios (POST, PUT, etc)
