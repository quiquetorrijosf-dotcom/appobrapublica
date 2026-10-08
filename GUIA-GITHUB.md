# Guía: subir ObraGest a GitHub (paso a paso, sin saber de git)

Tienes 2 caminos. Elige el que prefieras.

## Camino A — Con GitHub Desktop (el más fácil, recomendado)

1. Instala **GitHub Desktop**: https://desktop.github.com
2. Abre GitHub Desktop → **File → Add local repository** → elige la carpeta `app proyectos`.
   - Si te pregunta, pulsa **"create a repository here"** (o `Add`).
3. En GitHub Desktop verás tus archivos (`index.html`, `app.js`…).
   - Abajo a la izquierda escribe un mensaje: `ObraGest: gestión de obra pública`
   - Pulsa **Commit to main**.
4. Pulsa **Publish repository** (arriba).
   - Ponle nombre, p. ej. `obragest-obra-publica`.
   - Desmarca `Keep this code private` si quieres que Pages sea gratis y público.
   - Pulsa **Publish**.
5. Activa la web gratis:
   - Ve en el navegador a `https://github.com/TU_USUARIO/obragest-obra-publica`
   - **Settings → Pages** → en *Build and deployment* elige **GitHub Actions**.
   - Espera 1–2 minutos en la pestaña **Actions** hasta que el círculo se ponga verde.
   - Tu app estará en `https://TU_USUARIO.github.io/obragest-obra-publica/`

## Camino B — Con comandos (PowerShell)

1. Instala git: https://git-scm.com/download/win
2. Crea un repositorio **vacío** en https://github.com/new
   - Nombre: `obragest-obra-publica`, público, **sin** README ni .gitignore.
   - Copia su URL, p. ej. `https://github.com/TU_USUARIO/obragest-obra-publica.git`
3. Abre PowerShell en esta carpeta y ejecuta (cambia la URL por la tuya):

```powershell
git init
git add .
git commit -m "ObraGest: gestión de obra pública"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/obragest-obra-publica.git
git push -u origin main
```

O simplemente haz doble clic en `subir-a-github.bat` y pega tu URL cuando te la pida.

4. Activa Pages igual que en el Camino A paso 5 (Source = **GitHub Actions**).

## Comprobación final

- [ ] El repo contiene `index.html` en la raíz.
- [ ] En **Actions** el workflow `Deploy a GitHub Pages` está en verde.
- [ ] La URL `https://TU_USUARIO.github.io/TU_REPO/` abre ObraGest.
- [ ] Prueba: crea un proyecto → un subproyecto adjudicado → una tarea → registra horas → mira el Dashboard.

## Actualizar después de cambios

- GitHub Desktop: cambia archivos → **Commit** → **Push origin**.
- Comandos: `git add .`, `git commit -m "cambio"`, `git push`.

## Problemas típicos

| Error | Solución |
|---|---|
| `remote origin already exists` | `git remote set-url origin TU_URL` y luego `git push -u origin main` |
| `failed to push` / 403 | En GitHub → tu foto → **Settings → Developer settings → Personal access tokens**: crea un token clásico con permiso `repo` y úsalo como contraseña. |
| Pages da 404 | Espera 2 min; verifica que `index.html` esté en la raíz y que Pages use **GitHub Actions** (este repo ya trae `.github/workflows/pages.yml`). |
| Se subieron archivos raros | Revisa `.gitignore`; borra lo que no quieras y haz otro commit. |
