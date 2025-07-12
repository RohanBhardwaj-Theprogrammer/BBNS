# Function to start PostgreSQL server (you can adjust it for Docker or other methods)
function pgstart {
    param (
        [string]$baseDirectory = (Get-Location)  # Default to the current directory
    )

    Write-Host "Starting PostgreSQL server..." -ForegroundColor Green

    # Example PostgreSQL local startup (adjust for your setup)
    # Assuming pg_ctl is in your PATH, and you have a postgres instance already set up
    pg_ctl -D "C:\path\to\data" start

    # Alternatively, for Docker-based PostgreSQL
    # docker run --name postgres-container -e POSTGRES_PASSWORD=mysecretpassword -d postgres

    Write-Host "PostgreSQL started!" -ForegroundColor Green
}

# Function to start the React app in the identeefi-frontend-react folder
function reactstart {
    param (
        [string]$baseDirectory = (Get-Location)  # Default to the current directory
    )

    # Define the path to the React project (relative to the baseDirectory)
    $reactProjectPath = "$baseDirectory\finalproject\anti-counterfeit-product-identification-system-using-blockchain\identeefi-frontend-react"

    # Check if the directory exists
    if (Test-Path $reactProjectPath) {
        Write-Host "Starting React development server..." -ForegroundColor Green

        # Change to the React project directory
        Set-Location -Path $reactProjectPath

        # Install dependencies and start React app (if needed)
        npm install  # Install dependencies if they haven't been installed yet
        npm start    # Start the React development server

        Write-Host "React app started!" -ForegroundColor Green
    } else {
        Write-Host "React project not found at path: $reactProjectPath" -ForegroundColor Red
    }
}

# Function to run both PostgreSQL and React with the 'srun' command
function srun {
    param (
        [string]$baseDirectory = (Get-Location)  # Default to the current directory
    )

    # Start PostgreSQL server
    pgstart -baseDirectory $baseDirectory

    # Start React app in the identeefi-frontend-react folder
    reactstart -baseDirectory $baseDirectory
}

# Function to list folders and files in the current directory with index and colors
function lif {
    param (
        [string]$baseDirectory = (Get-Location)  # Default to the current directory
    )

    # List the contents of the current directory with index and different colors
    $folders = Get-ChildItem -Directory -Path $baseDirectory
    $files = Get-ChildItem -File -Path $baseDirectory

    # Display folders with green
    Write-Host "Folders:" -ForegroundColor Cyan
    $folders | ForEach-Object { Write-Host "$($_.Name)" -ForegroundColor Green }

    # Display files with blue
    Write-Host "Files:" -ForegroundColor Cyan
    $files | ForEach-Object { Write-Host "$($_.Name)" -ForegroundColor Blue }

    # Display combined list with index
    $index = 0
    $folders + $files | ForEach-Object {
        Write-Host "$index. $($_.Name)"
        $index++
    }
}

# Function to navigate into a subfolder or file by index or name
function m {
    param (
        [string]$folderIndexOrName, 
        [string]$baseDirectory = (Get-Location)
    )

    # Get all directories and files
    $items = Get-ChildItem -Path $baseDirectory
    $folders = $items | Where-Object { $_.PSIsContainer }
    $files = $items | Where-Object { -not $_.PSIsContainer }

    # Check if the argument is an index or a name
    if ($folderIndexOrName -match '^\d+$') {
        # If it's a number, use it as an index to navigate
        $index = [int]$folderIndexOrName
        if ($index -lt $folders.Count) {
            # Navigate to the folder by index
            Set-Location -Path $folders[$index].FullName
            Write-Host "Navigated to folder: $($folders[$index].Name)" -ForegroundColor Green
        } else {
            Write-Host "Invalid folder index" -ForegroundColor Red
        }
    } else {
        # If it's a name, try to match it
        $matchedFolder = $folders | Where-Object { $_.Name -eq $folderIndexOrName }
        if ($matchedFolder) {
            Set-Location -Path $matchedFolder.FullName
            Write-Host "Navigated to folder: $folderIndexOrName" -ForegroundColor Green
        } else {
            Write-Host "Folder '$folderIndexOrName' not found" -ForegroundColor Red
        }
    }
}

# Function to install node_modules in all relevant directories where package.json exists
function npm_i {
    param (
        [string]$baseDirectory = (Get-Location)  # Default to the current directory
    )

    # Search for all directories containing package.json
    $packageJsonDirs = Get-ChildItem -Recurse -Directory -Filter "package.json" -Path $baseDirectory

    # Install dependencies in each directory
    foreach ($dir in $packageJsonDirs) {
        Write-Host "Installing dependencies in: $($dir.FullName)" -ForegroundColor Green
        Set-Location -Path $dir.FullName
        npm install
    }

    Write-Host "Node modules installed in all directories containing package.json" -ForegroundColor Green
}

# Example Usage Documentation
Write-Host "Example Usage:" -ForegroundColor Blue

# Start PostgreSQL server
# pgstart -baseDirectory "C:\path\to\BBNS"

# Start React app in identeefi-frontend-react
# reactstart -baseDirectory "C:\path\to\BBNS"

# Run both PostgreSQL and React in one command
# srun -baseDirectory "C:\path\to\BBNS"

# List folders and files in the current directory
# lif -baseDirectory "C:\path\to\BBNS"

# Navigate into a folder by index or name
# m "foldername" or m 0

# Install node_modules in all subfolders where package.json is located
# npm_i -baseDirectory "C:\path\to\BBNS"
