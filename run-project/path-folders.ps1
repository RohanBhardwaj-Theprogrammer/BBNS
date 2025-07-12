# Function to list folders and files with color coding
function lif {
    param (
        [string]$baseDirectory
    )
    # Get the folders and files in the base directory
    $items = Get-ChildItem -Path $baseDirectory

    $index = 0
    foreach ($item in $items) {
        # Check if the item is a directory
        if ($item.PSIsContainer) {
            Write-Host "$index: [Directory] $($item.Name)" -ForegroundColor Cyan
        }
        # Otherwise, it is a file
        else {
            Write-Host "$index: [File] $($item.Name)" -ForegroundColor Yellow
        }
        $index++
    }
}

# Function to navigate to a folder or file using nested indices
function m {
    param (
        [string]$baseDirectory = (Get-Location),   # Default to the current directory if no baseDirectory is passed
        [string]$nestedIndices
    )

    # Split the nested indices by '-'
    $indices = $nestedIndices.Split('-')

    # Navigate through the directory structure based on the indices
    $currentPath = $baseDirectory
    foreach ($index in $indices) {
        $index = [int]$index

        # Get the items in the current directory
        $items = Get-ChildItem -Path $currentPath

        if ($index -ge 0 -and $index -lt $items.Count) {
            $item = $items[$index]

            if ($item.PSIsContainer) {
                # If it's a directory, update the current path
                $currentPath = $item.FullName
                Write-Host "Navigated to directory: $currentPath" -ForegroundColor Green
            } else {
                # If it's a file, open it (we'll just display the file content here for simplicity)
                Write-Host "Opening file: $item.FullName" -ForegroundColor Green
                Get-Content -Path $item.FullName
                return
            }
        } else {
            Write-Host "Invalid index: $index" -ForegroundColor Red
            return
        }
    }

    # Once the loop ends, print the final directory
    Write-Host "Final directory: $currentPath" -ForegroundColor Green
}

# Function to install node_modules for all subfolders where package.json is present
function npm_i {
    param (
        [string]$baseDirectory = (Get-Location)   # Default to the current directory if no baseDirectory is passed
    )

    # Find all package.json files in subdirectories and install node_modules
    $packageJsonFiles = Get-ChildItem -Path $baseDirectory -Recurse -Filter "package.json"

    foreach ($file in $packageJsonFiles) {
        $dir = $file.DirectoryName
        Write-Host "Installing node_modules in $dir" -ForegroundColor Green
        Set-Location -Path $dir
        npm install
    }
}

# Example Usage Documentation

Write-Host "Example Usage:" -ForegroundColor Blue

# List folders and files in the current directory (color-coded output):
# lif -baseDirectory "C:\path\to\directory"

# Navigate through nested directories using indices like 9-2-2-3-3:
# m -nestedIndices "9-2-2-3-3"

# Install node_modules in all directories containing a package.json:
# npm_i -baseDirectory "C:\path\to\project"

