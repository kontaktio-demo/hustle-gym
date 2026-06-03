@echo off
REM ============================================================
REM  Hustle Fitness - lokalny podglad strony
REM  Uruchamia serwer statyczny z obsluga clean URLs (jak Vercel)
REM ============================================================
title Hustle Fitness - localhost

where npx >nul 2>nul
if %errorlevel%==0 (
    echo Serwer: http://localhost:3000
    echo Nacisnij Ctrl+C aby zatrzymac.
    start "" "http://localhost:3000"
    npx --yes serve -l 3000
    goto :eof
)

REM Fallback: Python (bez clean URLs - strony prawne pod /regulamin.html)
where python >nul 2>nul
if %errorlevel%==0 (
    echo Serwer: http://127.0.0.1:8765
    start "" "http://127.0.0.1:8765/"
    python -m http.server 8765 --bind 127.0.0.1
    goto :eof
)

echo Brak Node (npx) oraz Pythona. Zainstaluj jedno z nich, aby uruchomic podglad.
pause
