@echo off
REM Windows batch file to run tests against production
set TEST_URL=https://martindokshomes.com
cd /d "%~dp0"
node test-website.js

