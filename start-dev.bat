@echo off
REM Start STEM-ED Architects - Frontend & Backend (Windows)
REM Usage: start-dev.bat

echo 🚀 Starting STEM-ED Architects Development Servers...

REM Kill existing processes (optional)
echo 📌 Checking for existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F 2>nul

REM Start backend
echo ▶️  Starting combined dev servers (API + Web)...
call npm run dev:all

echo.
echo ✅ Combined dev exited.
