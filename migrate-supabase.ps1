$ErrorActionPreference = 'Stop'

Write-Host 'Supabase to local PostgreSQL migration'
Write-Host 'Paste the Supabase database connection string without its password.'
$supabaseConnection = Read-Host 'Supabase connection string'

if ([string]::IsNullOrWhiteSpace($supabaseConnection)) {
  throw 'A Supabase connection string is required.'
}

$backupFile = Join-Path $PSScriptRoot 'supabase-backup.sql'
$localConnection = 'postgresql://postgres:admin@localhost:5432/my_app_db'

Write-Host 'Exporting Supabase schema and data...'
& pg_dump $supabaseConnection --file=$backupFile --no-owner --no-privileges
if ($LASTEXITCODE -ne 0) {
  throw 'Supabase export failed. Check the connection string, password, and pg_dump installation.'
}

Write-Host 'Importing into local PostgreSQL...'
& psql $localConnection --file=$backupFile
if ($LASTEXITCODE -ne 0) {
  throw 'Local import failed. Check that PostgreSQL is running and my_app_db exists.'
}

Write-Host 'Imported public tables:'
& psql $localConnection --command "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
Write-Host "Migration complete. Backup saved to $backupFile"