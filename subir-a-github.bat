@echo off
REM Subir ObraGest a GitHub - doble clic
setlocal
cd /d "%~dp0"
where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git no esta instalado.
  echo Instalalo desde https://git-scm.com/download/win y vuelve a intentarlo.
  pause
  exit /b 1
)
set /p REPO_URL=Pega la URL de tu repo vacio (https://github.com/TU_USUARIO/TU_REPO.git): 
if "%REPO_URL%"=="" (
  echo URL vacia. Operacion cancelada.
  pause
  exit /b 1
)
if not exist ".git" (
  git init
  git branch -M main
)
git add .
git commit -m "ObraGest: gestion de obra publica" 2>nul
if errorlevel 1 echo (Sin cambios nuevos para commitear o ya commiteado.)
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin %REPO_URL%
) else (
  git remote set-url origin %REPO_URL%
)
git branch -M main
echo Subiendo a %REPO_URL% ...
git push -u origin main
if errorlevel 1 (
  echo.
  echo [AVISO] Fallo el push. Causas tipicas: repo no vacio, sin permiso o falta login.
  echo Prueba: borra el remote con "git remote remove origin" o usa GitHub Desktop.
  pause
  exit /b 1
)
echo.
echo OK. Ahora activa Pages: repo en GitHub - Settings - Pages - Source: GitHub Actions.
pause
