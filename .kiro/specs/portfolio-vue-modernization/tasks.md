# Plan de Implementación: Modernización del Portfolio con Vue.js

## Visión General

Migración incremental del portfolio estático (Bootstrap 4 + jQuery) a una SPA moderna con Vue 3, Tailwind CSS, Naive UI, D3.js y Vite. Se construye de abajo hacia arriba: primero la estructura del proyecto y datos, luego composables, después componentes UI, secciones, y finalmente integración y build.

## Tareas

- [x] 1. Configurar estructura del proyecto y dependencias
  - [x] 1.1 Mover archivos del sitio actual a `legacy/` y crear proyecto Vue 3 con Vite
    - Crear carpeta `legacy/` y mover `index.html`, `style.css`, `css/`, `js/`, `imgs/`, `images/` allí
    - Inicializar proyecto Vue 3 con Vite (`npm create vite@latest . -- --template vue`)
    - Instalar dependencias: `vue-router`, `tailwindcss`, `postcss`, `autoprefixer`, `naive-ui`, `d3`, `aos`, `devicon`
    - Instalar dependencias de desarrollo: `vitest`, `@vue/test-utils`, `fast-check`, `jsdom`
    - _Requisitos: 1.1, 1.2, 14.1, 14.4_

  - [x] 1.2 Configurar Vite, Tailwind CSS, PostCSS y Vue Router
    - Crear `vite.config.js` con plugin Vue, alias `@` → `src/`, output a `docs/`, `emptyOutDir: false`
    - Crear `tailwind.config.js` con `darkMode: 'class'`, content paths `['./index.html', './src/**/*.{vue,js}']`
    - Crear `postcss.config.js` con tailwindcss y autoprefixer
    - Crear `src/style.css` con directivas `@tailwind base/components/utilities`
    - Crear `src/router.js` con `createWebHashHistory` y scroll behavior suave
    - _Requisitos: 12.4, 12.5, 14.2, 14.3, 14.5_

  - [x] 1.3 Crear `index.html`, `src/main.js` y `src/App.vue` base
    - `index.html` con div `#app`, links a Font Awesome y Devicons CDN
    - `src/main.js` con createApp, router, AOS init con check `prefers-reduced-motion`
    - `src/App.vue` esqueleto con `<router-view>` y estructura básica de layout
    - Crear estructura de directorios: `src/components/{layout,sections,ui}`, `src/composables`, `src/data`, `src/assets/imgs`
    - _Requisitos: 13.2, 14.1, 14.4_

- [x] 2. Crear capa de datos
  - [x] 2.1 Crear archivos de datos: `personal.js`, `skills.js`, `experience.js`, `education.js`, `projects.js`, `hobbies.js`
    - `src/data/personal.js`: fullName, title, subtitle, location, email, phone, profileImage, cvLink, socialLinks, aboutMe
    - `src/data/skills.js`: objeto con `technical` (name, icon, details, level), `soft` (name, icon), `languages` (name, level)
    - `src/data/experience.js`: array de posiciones con id, title, company, period, startDate, icon, description, responsibilities
    - `src/data/education.js`: objeto con `degrees`, `certifications` (con credlyUrl), `courses`
    - `src/data/projects.js`: array con id, title, description, image, type, technologies, links
    - `src/data/hobbies.js`: array con name, icon, description
    - Poblar con todo el contenido real del portfolio en español
    - _Requisitos: 2.1, 2.2, 2.3_

  - [x] 2.2 Escribir test de propiedad para validación de esquema de datos
    - **Propiedad 1: Validación de esquema de datos**
    - Verificar que cada módulo de datos exportado conforma su esquema esperado
    - Usar fast-check para generar variaciones y validar estructura
    - **Valida: Requisitos 2.1, 5.4**

- [x] 3. Implementar composables
  - [x] 3.1 Implementar `useTheme.js`
    - Estado reactivo `isDark` con ref
    - `init()`: leer localStorage, fallback a `prefers-color-scheme`
    - `watchEffect` para sincronizar clase `dark` en `<html>` y persistir en localStorage
    - `toggleTheme()` para invertir estado
    - Try/catch en accesos a localStorage para modo incógnito
    - _Requisitos: 12.1, 12.2, 12.3, 12.5_

  - [x] 3.2 Escribir test de propiedad para round-trip de tema
    - **Propiedad 11: Round-trip de tema (toggle y persistencia)**
    - Verificar que toggleTheme invierte isDark, sincroniza clase dark y persiste en localStorage
    - **Valida: Requisitos 12.1, 12.2, 12.3, 12.5**

  - [x] 3.3 Implementar `useScrollSpy.js`
    - IntersectionObserver con rootMargin `-20% 0px -70% 0px`
    - Ref `activeSection` actualizado al intersectar
    - Verificar existencia de IntersectionObserver antes de usar
    - Desconectar observer en `onUnmounted`
    - _Requisitos: 11.2_

  - [x] 3.4 Escribir test de propiedad para scroll spy
    - **Propiedad 9: Scroll spy identifica sección activa correctamente**
    - Simular IntersectionObserver y verificar que activeSection se actualiza al ID correcto
    - **Valida: Requisito 11.2**

  - [x] 3.5 Implementar `useCopyToClipboard.js`
    - Clipboard API con fallback a `document.execCommand('copy')`
    - Estado `copied` con auto-reset tras 2 segundos
    - Manejo de errores sin crash
    - _Requisitos: 3.2, 10.2_

  - [x] 3.6 Escribir test de propiedad para copiar al portapapeles
    - **Propiedad 4: Round-trip de copiar al portapapeles**
    - Verificar que para cualquier string no vacío, copy() establece copied=true y luego vuelve a false
    - **Valida: Requisitos 3.2, 10.2**

- [x] 4. Checkpoint - Verificar composables
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 5. Implementar componentes UI compartidos
  - [x] 5.1 Implementar `SectionWrapper.vue`
    - Props: `id` (String), `title` (String, opcional), `aos` (String, default 'fade-up')
    - Atributo `data-aos` para animaciones AOS
    - Padding y max-width consistentes con Tailwind
    - Título `<h2>` opcional con estilo uniforme
    - Slot default para contenido de la sección
    - _Requisitos: 13.1_

  - [x] 5.2 Implementar `ThemeToggle.vue`
    - Usa composable `useTheme`
    - Ícono sol/luna que alterna entre temas
    - Transición suave del ícono
    - _Requisitos: 12.2_

  - [x] 5.3 Implementar `SkillCategoryCard.vue`
    - Props: categoría de skill (name, icon, details, level)
    - Renderizar ícono devicon con clase CSS correspondiente
    - Mostrar detalles de la categoría
    - _Requisitos: 5.2, 5.4_

  - [x] 5.4 Escribir test de propiedad para íconos devicon
    - **Propiedad 6: Íconos devicon presentes para items con tecnologías**
    - Verificar que items con campo de ícono devicon renderizan elemento con la clase CSS correcta
    - **Valida: Requisitos 5.2, 8.3**

  - [x] 5.5 Implementar `ExperienceTimelineItem.vue`
    - Props: item de experiencia (title, company, period, description, responsibilities)
    - Expandible/colapsable con estado reactivo `isExpanded`
    - Animación de expand/collapse con transition de Vue
    - _Requisitos: 6.2, 6.3_

  - [x] 5.6 Implementar `CertificationCard.vue`
    - Props: certificación (title, issuer, date, credlyUrl, credentialId)
    - Badge Credly como enlace externo con `target="_blank" rel="noopener"`
    - Mostrar credential ID si aplica
    - _Requisitos: 7.2, 7.3_

  - [x] 5.7 Implementar `ProjectCard.vue`
    - Props: proyecto (title, description, image, type, technologies, links)
    - Imagen, título, descripción, tecnologías con devicons, enlaces
    - Hover effect con scale transform
    - Enlaces con `target="_blank" rel="noopener"`
    - _Requisitos: 8.1, 8.2, 8.3_

  - [x] 5.8 Escribir test de propiedad para enlaces externos
    - **Propiedad 8: Enlaces externos abren en nueva pestaña**
    - Verificar que todos los `<a>` con URLs externas tienen `target="_blank"` y `rel="noopener"`
    - **Valida: Requisitos 7.2, 8.2, 8.4**

  - [x] 5.9 Implementar `SocialLinks.vue`
    - Props: array de social links (name, url, icon)
    - Renderizar íconos Font Awesome con enlaces
    - `target="_blank" rel="noopener"` en todos los enlaces
    - _Requisitos: 10.3_

  - [x] 5.10 Implementar `SkillsChart.vue` con D3.js
    - Props: array de skills técnicos (name, level, icon)
    - Ref del DOM (`chartRef`) para D3
    - `onMounted` → renderChart(), `watch(isDark)` → re-render al cambiar tema
    - Limpiar SVG anterior antes de re-renderizar
    - Bubble chart o bar chart interactivo con tooltips
    - Mensaje "Sin datos" si array vacío
    - Responsivo con resize observer
    - _Requisitos: 5.1, 5.3, 5.5_

  - [x] 5.11 Escribir test de propiedad para D3 renderiza elementos por skill
    - **Propiedad 5: D3 renderiza un elemento visual por skill**
    - Verificar que para N skills, el SVG contiene exactamente N elementos visuales
    - **Valida: Requisito 5.1**

- [x] 6. Checkpoint - Verificar componentes UI
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 7. Implementar componentes de layout
  - [x] 7.1 Implementar `AppNavbar.vue`
    - Barra fija (`fixed top-0`) con Tailwind
    - Menú hamburguesa en móvil con estado reactivo `isMenuOpen`
    - Scroll spy con `useScrollSpy` para resaltar sección activa
    - Incluir `ThemeToggle` y enlaces de navegación
    - Al clic en item del menú hamburguesa: navegar + cerrar menú (`isMenuOpen = false`)
    - Scroll suave con `scrollIntoView({ behavior: 'smooth' })`
    - _Requisitos: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 7.2 Escribir test de propiedad para menú hamburguesa
    - **Propiedad 10: Menú hamburguesa se cierra al navegar**
    - Verificar que al ejecutar navegación con isMenuOpen=true, cambia a false
    - **Valida: Requisito 11.5**

  - [x] 7.3 Implementar `AppFooter.vue`
    - Copyright, enlaces a redes sociales
    - Estilo consistente con el tema claro/oscuro
    - _Requisitos: 10.3_

- [x] 8. Implementar secciones del portfolio
  - [x] 8.1 Implementar `HeroSection.vue`
    - Importar datos de `@/data/personal.js`
    - Foto de perfil circular (`rounded-full`), nombre, título, ubicación
    - Botón copiar email con `useCopyToClipboard` y feedback visual
    - Layout centrado, responsivo con `flex-col` en móvil
    - Envolver con `SectionWrapper`
    - _Requisitos: 3.1, 3.2, 3.3_

  - [x] 8.2 Implementar `AboutSection.vue`
    - Importar datos de `@/data/personal.js` (campo aboutMe)
    - Tipografía legible y espaciado adecuado
    - Envolver con `SectionWrapper`
    - _Requisitos: 4.1, 4.2_

  - [x] 8.3 Implementar `SkillsSection.vue`
    - Importar datos de `@/data/skills.js`
    - Categorizar: technical (con `SkillsChart` + `SkillCategoryCard`), soft skills, idiomas
    - Layout responsivo para las tres categorías
    - Envolver con `SectionWrapper`
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 8.4 Implementar `ExperienceSection.vue`
    - Importar datos de `@/data/experience.js`
    - Ordenar posiciones por `startDate` descendente
    - Timeline vertical con `ExperienceTimelineItem` para cada posición
    - Envolver con `SectionWrapper`
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [x] 8.5 Escribir test de propiedad para orden cronológico
    - **Propiedad 7: Experiencias ordenadas cronológicamente**
    - Verificar que después de ordenar, cada elemento tiene startDate >= siguiente
    - **Valida: Requisito 6.4**

  - [x] 8.6 Implementar `EducationSection.vue`
    - Importar datos de `@/data/education.js`
    - Mostrar títulos académicos, certificaciones con `CertificationCard`, cursos
    - Envolver con `SectionWrapper`
    - _Requisitos: 7.1, 7.2, 7.3_

  - [x] 8.7 Implementar `ProjectsSection.vue`
    - Importar datos de `@/data/projects.js`
    - Grid responsivo (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) con `ProjectCard`
    - Soportar tipos: proyecto personal, charla, evento comunitario
    - Envolver con `SectionWrapper`
    - _Requisitos: 8.1, 8.2, 8.3, 8.4_

  - [x] 8.8 Implementar `HobbiesSection.vue`
    - Importar datos de `@/data/hobbies.js`
    - Grid responsivo con íconos y descripciones
    - Envolver con `SectionWrapper`
    - _Requisitos: 9.1, 9.2_

  - [x] 8.9 Implementar `ContactSection.vue`
    - Importar datos de `@/data/personal.js`
    - Email y teléfono con botón copiar (`useCopyToClipboard`) y feedback visual
    - `SocialLinks` con íconos de redes sociales
    - Envolver con `SectionWrapper`
    - _Requisitos: 10.1, 10.2, 10.3_

- [x] 9. Checkpoint - Verificar secciones
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 10. Integración y wiring final
  - [x] 10.1 Integrar todas las secciones en `App.vue`
    - Importar y montar: AppNavbar, HeroSection, AboutSection, SkillsSection, ExperienceSection, EducationSection, ProjectsSection, HobbiesSection, ContactSection, AppFooter
    - Inicializar tema con `useTheme().init()`
    - Verificar que el scroll spy funciona con todas las secciones
    - _Requisitos: 1.3, 11.1, 11.2, 11.3_

  - [x] 10.2 Migrar imágenes y assets a `src/assets/imgs/` y `public/`
    - Copiar imágenes del sitio legacy necesarias para el nuevo sitio
    - Favicon en `public/`
    - CV PDF en `public/`
    - Actualizar rutas de imágenes en archivos de datos
    - _Requisitos: 3.1, 8.1_

  - [x] 10.3 Escribir tests de propiedad para cantidad de elementos y completitud de campos
    - **Propiedad 2: Cantidad de elementos renderizados coincide con datos**
    - **Propiedad 3: Completitud de campos renderizados**
    - Verificar que para arrays de longitud N se renderizan N elementos hijos
    - Verificar que campos requeridos están presentes en el renderizado
    - **Valida: Requisitos 2.3, 3.1, 4.1, 6.1, 6.3, 7.1, 7.3, 8.1, 9.1, 10.1, 10.3**

  - [x] 10.4 Configurar build para GitHub Pages
    - Verificar que `npm run build` genera output en `docs/`
    - Verificar que `legacy/` no se borra durante el build (`emptyOutDir: false`)
    - Verificar que el hash router funciona correctamente en el build
    - Agregar script de build en `package.json` si no existe
    - _Requisitos: 1.2, 1.4, 14.2, 14.3, 14.5_

- [x] 11. Checkpoint final - Verificar integración completa
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedades validan propiedades universales de correctitud
- Los tests unitarios validan ejemplos específicos y edge cases
- El contenido del portfolio debe estar en español según los datos del sitio original
