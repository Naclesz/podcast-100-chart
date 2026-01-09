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

### Testing

- **Vitest** - Test runner rápido y moderno para Vite
- **React Testing Library** - Testing de componentes React
- **@testing-library/jest-dom** - Matchers adicionales para assertions
- **jsdom** - Simulación del DOM para tests
- **Playwright** - Testing E2E

#### 🧪 Comandos de Testing

```bash
# Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
npm test

# Abrir UI interactiva de Vitest en el navegador
npm run test:ui

# Generar reporte de cobertura de código
npm run test:coverage

# Ejecutar teste E2E
npm run test:e2e
```

---

## 📂 Estructura de directorios

La aplicación sigue una **arquitectura hexagonal (puertos y adaptadores)** con programación funcional y principios SOLID:

### Estructura de Capas

- **domain/** - Lógica de negocio pura (independiente del framework)
  - `models/` - Entidades del dominio (Podcast, Episode, etc.)
  - `repositories/` - Interfaces de repositorios (PUERTOS)
  - `usecases/` - Funciones puras con lógica de negocio

- **infrastructure/** - Implementaciones de sistemas externos (ADAPTADORES)
  - `adapters/` - Implementaciones de repositorios (HTTP, localStorage)
  - `http/` - Cliente HTTP genérico
  - `mappers/` - Transformadores de datos externos → modelos de dominio
  - `dto/` - Tipos de respuesta de APIs externas

- **application/** - Capa de orquestación específica de React
  - `context/` - Gestión de estado global (React Context + useReducer)
  - `hooks/` - Custom hooks que orquestan usecases del dominio
  - `di/` - Inyección de dependencias (composition root)

- **presentation/** - Capa de interfaz de usuario
  - `components/` - Componentes React (Atomic Design: atoms, molecules, organisms, templates)
  - `pages/` - Vistas principales que representan rutas
  - `router/` - Configuración de navegación con React Router

- **shared/** - Utilidades y configuración compartida
  - `config/` - Configuración de API y endpoints
  - `utils/` - Funciones de utilidad puras
  - `constants/` - Constantes de la aplicación

- **styles/** - Estilos globales SCSS con variables, mixins y placeholders

## 🎯 Principios SOLID y Arquitectura Hexagonal

La aplicación implementa **Hexagonal Architecture (Ports & Adapters)** que naturalmente cumple con los principios SOLID:

### Single Responsibility Principle (SRP)
Cada capa tiene una única responsabilidad:
- **Domain**: Solo contiene lógica de negocio pura
  - `get-podcasts.usecase.ts` - Solo obtiene podcasts
  - `filter-podcasts.usecase.ts` - Solo filtra podcasts
- **Infrastructure**: Solo implementa acceso a sistemas externos
  - `http-client.ts` - Solo maneja comunicación HTTP
  - `podcast.mapper.ts` - Solo transforma datos de API → dominio
- **Application**: Solo orquesta usecases con React
  - `usePodcasts.tsx` - Solo conecta React con usecases de podcasts
- **Presentation**: Solo renderiza UI
  - `PodcastCard.tsx` - Solo muestra una tarjeta de podcast

### Open/Closed Principle (OCP)
Abierto para extensión, cerrado para modificación:
- Se pueden agregar nuevas implementaciones de repositorios sin modificar el dominio
- Ejemplo: `CachedPodcastRepository` puede decorar `HttpPodcastRepository` sin cambiar código existente
- Nuevos usecases se agregan sin modificar usecases existentes
- El cliente HTTP se puede extender para soportar POST, PUT, etc. sin modificar el existente

### Liskov Substitution Principle (LSP)
Las implementaciones son intercambiables:
- Cualquier clase que implemente `IPodcastRepository` puede usarse en lugar de otra
- `HttpPodcastRepository` y `MockPodcastRepository` (para tests) son intercambiables
- El dominio funciona con cualquier implementación que cumpla el contrato

### Interface Segregation Principle (ISP)
Interfaces específicas y pequeñas:
- `IPodcastRepository` - Solo métodos relacionados con podcasts
- `IStorageRepository` - Solo métodos relacionados con almacenamiento
- `IHttpClient` - Solo método `get` (se puede extender según necesidad)

### Dependency Inversion Principle (DIP)
Las dependencias apuntan hacia abstracciones:
- El **dominio** define interfaces (`IPodcastRepository`)
- La **infraestructura** implementa esas interfaces
- La **aplicación** depende del dominio, no de la infraestructura
- Inyección de dependencias en `application/di/dependencies.ts`

```
Flujo de dependencias:
Presentation → Application → Domain ← Infrastructure
                               ↑
                          (Interfaces)
```

### Beneficios de esta arquitectura:

1. **Testabilidad**: La lógica de negocio es pura, fácil de testear sin mocks
2. **Mantenibilidad**: Cada capa tiene responsabilidades claras
3. **Flexibilidad**: Se puede cambiar la infraestructura (HTTP por GraphQL) sin tocar el dominio
4. **Escalabilidad**: Fácil agregar nuevas features siguiendo el mismo patrón
