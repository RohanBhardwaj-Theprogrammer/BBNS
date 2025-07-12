# interactive-setup.ps1
 cd  "finalproject";
 cd (ls)[0]; cd (ls)[0];
# Ask the user what they would like to do
$choice = Read-Host "What would you like to do? (1) Build the app (2) Build and Start the app (3) Start the app"

# Handle user input
if ($choice -eq "1") {
    Write-Host "Running npm run build..."
    # Run the build command
    npm run build
} elseif ($choice -eq "2") {
    Write-Host "Running npm run build..."
    # Run the build command
    npm run build
    
    # After build, start the app using npm start
    Write-Host "Starting the app using npm start..."
    npm start
} elseif ($choice -eq "3") {
    Write-Host "Starting the app using npm start..."
    # Run the start command without building
    npm run start
} else {
    Write-Host "Invalid option. Please enter 1, 2, or 3."
}
