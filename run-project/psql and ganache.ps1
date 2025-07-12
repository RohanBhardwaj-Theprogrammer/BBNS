# Function to start Ganache
function start-ganache {
    param (
        [string]$configPath = "paths.json"
    )

    # Read the paths.json file
    $config = Get-Content -Path $configPath | ConvertFrom-Json

    $ganachePath = $config.ganache

    if (Test-Path $ganachePath) {
        Write-Host "Starting Ganache..." -ForegroundColor Green

        # Start Ganache CLI (you can modify command as per your requirements)
        Start-Process -FilePath $ganachePath -ArgumentList "--detached"

        Write-Host "Ganache started!" -ForegroundColor Green
    } else {
        Write-Host "Ganache path not found!" -ForegroundColor Red
    }
}

# Function to start PostgreSQL
function start-postgresql {
    param (
        [string]$configPath = "paths.json"
    )

    # Read the paths.json file
    $config = Get-Content -Path $configPath | ConvertFrom-Json

    $psqlPath = $config.psql
    $postgresDataPath = $config.postgresDataPath

    if (Test-Path $psqlPath -and Test-Path $postgresDataPath) {
        Write-Host "Starting PostgreSQL..." -ForegroundColor Green

        # Start PostgreSQL server (adjust command to match your environment)
        Start-Process -FilePath $psqlPath -ArgumentList "start -D $postgresDataPath"

        Write-Host "PostgreSQL started!" -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL path or data directory not found!" -ForegroundColor Red
    }
}

# Function to stop Ganache
function stop-ganache {
    param (
        [string]$configPath = "paths.json"
    )

    # Read the paths.json file
    $config = Get-Content -Path $configPath | ConvertFrom-Json

    $ganachePath = $config.ganache

    if (Test-Path $ganachePath) {
        Write-Host "Stopping Ganache..." -ForegroundColor Red

        # Stop Ganache CLI (you can modify the process killing command as per your environment)
        Get-Process -Name "ganache" -ErrorAction SilentlyContinue | Stop-Process

        Write-Host "Ganache stopped!" -ForegroundColor Red
    } else {
        Write-Host "Ganache path not found!" -ForegroundColor Red
    }
}

# Function to stop PostgreSQL
function stop-postgresql {
    param (
        [string]$configPath = "paths.json"
    )

    # Read the paths.json file
    $config = Get-Content -Path $configPath | ConvertFrom-Json

    $psqlPath = $config.psql

    if (Test-Path $psqlPath) {
        Write-Host "Stopping PostgreSQL..." -ForegroundColor Red

        # Stop PostgreSQL server (this assumes you have PostgreSQL running as a process)
        # Adjust the following command based on your actual PostgreSQL process
        Get-Process -Name "postgres" -ErrorAction SilentlyContinue | Stop-Process

        Write-Host "PostgreSQL stopped!" -ForegroundColor Red
    } else {
        Write-Host "PostgreSQL path not found!" -ForegroundColor Red
    }
}

# Example Usage
Write-Host "Example Usage:" -ForegroundColor Blue

# Start Ganache
# start-ganache -configPath "C:\path\to\paths.json"

# Start PostgreSQL
# start-postgresql -configPath "C:\path\to\paths.json"

# Stop Ganache
# stop-ganache -configPath "C:\path\to\paths.json"

# Stop PostgreSQL
# stop-postgresql -configPath "C:\path\to\paths.json"
