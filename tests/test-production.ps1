# PowerShell script to run tests against production
$env:TEST_URL = "https://martindokshomes.com"
Set-Location $PSScriptRoot
node test-website.js

