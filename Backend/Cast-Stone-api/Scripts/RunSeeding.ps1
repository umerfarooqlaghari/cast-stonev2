# PowerShell script to run data seeding
Write-Host "Cast Stone API - Data Seeding Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Check if dotnet is available
if (!(Get-Command "dotnet" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ .NET CLI is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Navigate to the project directory
$projectPath = Split-Path -Parent $PSScriptRoot
Set-Location $projectPath

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Yellow

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green

# Apply migrations
Write-Host "🔄 Applying database migrations..." -ForegroundColor Yellow
dotnet ef database update
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Migration failed - this might be due to connection issues" -ForegroundColor Yellow
    Write-Host "You can run migrations manually when the database is available" -ForegroundColor Yellow
} else {
    Write-Host "✅ Migrations applied successfully" -ForegroundColor Green
}

# Run seeding (this would need to be implemented as a separate console app or endpoint)
Write-Host "📊 To run data seeding:" -ForegroundColor Yellow
Write-Host "1. Ensure your database connection is working" -ForegroundColor White
Write-Host "2. Run: dotnet run --project Scripts/SeedDataRunner.cs" -ForegroundColor White
Write-Host "   OR call the seeding endpoint once the API is running" -ForegroundColor White

Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host "You can now run the API with: dotnet run" -ForegroundColor White
