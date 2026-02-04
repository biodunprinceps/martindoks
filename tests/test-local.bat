@echo off
REM Windows batch file to run tests against local server
set TEST_URL=http://localhost:3000
cd /d "%~dp0"
node test-website.js

