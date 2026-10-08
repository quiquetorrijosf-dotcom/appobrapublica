# ObraGest — Gestión de Proyectos de Obra Pública

Aplicación web lista para usar, sin compilación ni dependencias. Ideal para equipos especializados en obra pública: reparte tareas, adjudica subproyectos a miembros, gestiona tiempos y controla avances.

![stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-blue) ![storage](https://img.shields.io/badge/storage-LocalStorage-green) ![deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-black)

## Funcionalidades

- **Dashboard**: KPIs (proyectos activos, tareas abiertas, horas, avance medio), gráfico de avance por proyecto, próximas entregas, carga por miembro.
- **Proyectos**: código de expediente, tipo de obra (carretera, hidráulica, edificación…), ubicación, presupuesto, fechas, estado, responsable.
- **Subproyectos / Lotes**: adjudicación a un miembro del equipo, presupuesto parcial, fechas, avance auto-calculado desde tareas.
- **Tareas**: reparto por proyecto/subproyecto y miembro, prioridad, estado (Kanban: pendiente / en curso / revisión / hecha), fechas, horas estimadas vs. registradas, avance %.
- **Equipo**: roles de obra (jefe/a de obra, arquitecto/a, ingeniero/a, aparejador, topógrafo, seguridad y salud…), carga de trabajo y rendimiento.
- **Tiempos**: partes de horas por tarea y miembro, diagrama Gantt por proyecto, control de desviaciones.
- **Informes**: avance global, tabla exportable a CSV, copia de seguridad JSON (exportar/importar).

Los datos se guardan en el navegador (`localStorage`). Incluye datos de ejemplo para empezar.

## Ejecución local (3 opciones)

### Opción A — Doble clic (más rápida)
1. Descarga o clona este repositorio.
2. Abre `index.html` en el navegador.

### Opción B — Servidor local con Python (recomendada)
```bash
python -m http.server 8000
# abre http://localhost:8000
```

### Opción C — Servidor local con Node
```bash
npx serve .
# o
node server.js   # servidor sin dependencias (usa solo módulos estándar)
```

## Subir a GitHub y publicar

> **Guía detallada para no técnicos:** lee `GUIA-GITHUB.md`. Atajo en Windows: haz doble clic en `subir-a-github.bat` y pega la URL de tu repo vacío.

```bash
git init
git add .
git commit -m "ObraGest: gestión de obra pública"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### Publicar en GitHub Pages (gratis)
1. En GitHub ve a **Settings → Pages**.
2. En **Source** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guarda. En 1–2 minutos estará en `https://TU_USUARIO.github.io/TU_REPO/`.

Este repo ya incluye el workflow `.github/workflows/pages.yml` para despliegue automático con Actions (no requiere configuración).

## Estructura

```
.
├── index.html      # App (SPA)
├── styles.css      # Diseño responsive
├── app.js          # Lógica: CRUD, Kanban, Gantt, informes, persistencia
├── server.js       # Servidor estático Node sin dependencias (opcional)
├── db.seed.json    # Datos de ejemplo (también embebidos en app.js)
├── .github/workflows/pages.yml
├── .gitignore
└── README.md
```

## Uso guiado (2 minutos)

1. Ve a **Equipo** y crea a tu gente (nombre + rol).
2. En **Proyectos** crea una obra: p. ej. `Rehabilitación puente N-340`, expediente `2026-OB-014`, presupuesto y fechas.
3. En **Subproyectos** crea lotes (p. ej. `Lote 1: Estructura`) y **adjudícalos** a un miembro.
4. En **Tareas** reparte trabajo: asigna responsable, fechas y horas estimadas. Arrastra o cambia el estado en el Kanban y actualiza el **% de avance**.
5. En **Tiempos** registra partes de horas reales por tarea.
6. Vigila el **Dashboard**: el avance de cada proyecto se recalcula solo (media ponderada por horas estimadas).

### Cálculo de avances
- **Tarea**: % manual (0–100; al pasar a “Hecha” se pone 100 automáticamente).
- **Subproyecto**: media ponderada de sus tareas por horas estimadas.
- **Proyecto**: media ponderada de todas sus tareas (incluidas las directas sin subproyecto).

## Privacidad y multiusuario
Todo queda en el navegador de cada usuario. Para compartir estado: **Informes → Exportar JSON** y los compañeros lo importan. Si necesitas backend multiusuario real (API + base de datos), esta base es fácilmente extensible: los objetos `proyectos`, `subproyectos`, `tareas`, `miembros` y `partes` ya tienen `id` y forma de API REST.

## Licencia
MIT — úsala libremente en tu organización.
