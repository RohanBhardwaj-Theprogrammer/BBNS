# Define PostgreSQL connection details
$dbHost = "localhost"      # Changed from $host to $dbHost
$port = 5432
$dbname = "postgres"
$user = "postgres"
$password = "posgress"     # Change this to your actual PostgreSQL password

# Define the SQL statements for dropping existing tables, creating new tables, and inserting default data
$sql_drop_tables = @"
DROP TABLE IF EXISTS public.auth;
DROP TABLE IF EXISTS public.profile;
DROP TABLE IF EXISTS public.product;
"@

$sql_create_tables = @"
CREATE TABLE IF NOT EXISTS public.auth (
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profile (
    name VARCHAR(50),
    description VARCHAR(500),
    username VARCHAR(50) NOT NULL,
    website VARCHAR,
    location VARCHAR(50),
    image VARCHAR(50),
    role VARCHAR(50),
    id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS public.product (
    name VARCHAR(50),
    serialnumber VARCHAR(50) NOT NULL PRIMARY KEY,
    brand VARCHAR(50)
);
"@

$sql_insert_data = @"
INSERT INTO public.auth (username, password, role) 
VALUES ('admin', 'admin', 'admin')
ON CONFLICT (username) DO NOTHING;  -- Avoid duplicate entries if the script is run multiple times
"@

# SQL to check if the user exists
$sql_check_user = @"
SELECT 1 FROM pg_roles WHERE rolname = '$user';
"@

# SQL to create a new user if not exists
$sql_create_user = @"
DO
\$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$user') THEN
        CREATE ROLE $user WITH LOGIN PASSWORD '$password';
        ALTER ROLE $user CREATEDB CREATEROLE;
    END IF;
END
\$$;
"@

# Function to execute SQL command using psql
function Execute-SQL {
    param (
        [string]$sql
    )
    
    $connectionString = "host=$dbHost port=$port dbname=$dbname user=$user password=$password"

    # Using the psql command-line utility to execute the SQL command
    $psqlCommand = "psql -h $dbHost -p $port -U $user -d $dbname -c `"$sql`""

    # Run the psql command
    Write-Host "Executing SQL command..."
    Invoke-Expression $psqlCommand
}

# Function to show the structure of all tables
function Show-TablesStructure {
    $showStructureSQL = @"
    \d auth;
    \d profile;
    \d product;
"@
    Execute-SQL -sql $showStructureSQL
}

# Function to create the user if not exists
function Ensure-UserExists {
    Write-Host "Checking if user $user exists..."
    
    $userExists = Execute-SQL -sql $sql_check_user
    if ($userExists -match "1 row") {
        Write-Host "User $user already exists."
    } else {
        Write-Host "User $user does not exist. Creating the user..."
        Execute-SQL -sql $sql_create_user
        Write-Host "User $user created successfully."
    }
}

# Execute table drop (if they exist), table creation, data insertion and user check
Write-Host "Ensuring the PostgreSQL user exists..."
Ensure-UserExists

Write-Host "Dropping existing tables (if any)..."
Execute-SQL -sql $sql_drop_tables
Write-Host "Existing tables dropped (if any)."

Write-Host "Creating tables and inserting default data..."
Execute-SQL -sql $sql_create_tables
Write-Host "Tables created successfully!"

Execute-SQL -sql $sql_insert_data
Write-Host "Default data inserted successfully!"

# Show the structure of the tables
Write-Host "Displaying structure of tables..."
Show-TablesStructure

Write-Host "PostgreSQL user, tables, and data setup complete!"
