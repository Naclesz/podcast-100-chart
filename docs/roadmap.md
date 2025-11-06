# 🗺️ Roadmap del Proyecto

Este roadmap define los pasos de desarrollo del proyecto.

---

## Paso 0 (v0) — Setup inicial y configuración

- [x] Inicializar Vite + React + TypeScript
- [x] Configurar SCSS (`sass`) y estructura `styles/`
- [x] Configurar imports absolutos (`tsconfig.json` + `vite.config.ts`)
- [x] Añadir ESLint + Prettier con reglas para TS/React
- [x] Añadir React Testing Library
- [x] Configurar React Router (rutas base)
- [x] Crear esqueleto de context API
- [x] Añadir README con stack + decisiones de diseño
- [x] Crear layout header + main para reutilizar en las distintas páginas

---

## Paso 1 (v1) — Pantalla Home + persistencia en Context

- [x] Implementar servicio para obtener los podcasts y persistirlos
- [x] Crear custom hook para gestionar los podcasts
- [x] Mostrar listado de podcasts
- [x] Añadir tests unitarios

---

## Paso 2 (v2) — Pantalla Podcast (detalle)

- [x] Implementar servicio para obtener detalle del podcast
- [x] Crear custom hook gestionar detalle del podcast
- [x] Mostrar detalle y episodios del podcast
- [x] Añadir tests unitarios

---

## Paso 3 (v3) — Pantalla Episodio

- [x] Crear custom hook gestionar detalle episodio de un podcast
- [x] Mostrar información del episodio
- [x] Reproducir episodio
- [ ] Añadir tests unitarios

---

## Paso 4 (v4) — Calidad del proyecto

- [x] Configurar Husky + lint-staged con pre-commit (lint)
- [x] Añadir tests end-to-end (Playwright) Solo se han añadido unos test e2e básicos en la home page
- [x] Validar que los commits no se aceptan si fallan lint/tests

---

## Paso 5 (v5) — Enhancements (UX/UI)

- [ ] Añadir skeleton loading en Home, PodcastDetail y EpisodeDetail
- [ ] Implementar Dark Mode con SCSS variables
- [x] Mejorar accesibilidad (roles, labels, focus states)
- [x] Añadir mensajes de error y empty states consistentes

---
