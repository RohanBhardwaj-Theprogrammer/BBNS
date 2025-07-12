# Get the name of the current folder
$currentFolder = Split-Path -Leaf (Get-Location)

# Check if the current folder is 'backend'
if ($currentFolder -eq "backend") {
    # Run the npm install command
    npm install express body-parser ethers dotenv cors;
    @"
PRIVATE_KEY=your-private-key-here
RPC_URL=https://rpc-mumbai.matic.today
CONTRACT_ADDRESS=your-smart-contract-address
"@ | Out-File -FilePath .\.env -Encoding UTF8

} else {
    # Output a message indicating the folder is incorrect
    Write-Output "Current folder is not the required folder: backend"
}
