# PowerShell script to run tests against local server
$env:TEST_URL = "http://localhost:3000"
Set-Location $PSScriptRoot
node test-website.js

