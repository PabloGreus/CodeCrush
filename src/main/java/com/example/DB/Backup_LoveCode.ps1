# CONFIGURACION
$mysqlDump = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
$servidor = "192.168.16.3"
$usuario = "backup_user"
$password = "Backup1234!"
$baseDatos = "love_code"
$carpetaBackup = ""

# CREAR CARPETA SI NO EXISTE
if (!(Test-Path -Path $carpetaBackup)) {
    New-Item -ItemType Directory -Path $carpetaBackup
}

# fecha para el nombre del archivo
$fecha = Get-Date -Format "yyyyMMdd_HHmmss"
$archivoBackup = "$carpetaBackup\backup_${LoveCOde}_$fecha.sql"

# HACER BACKUP
&$mysqlDump --host=$servidor --user=$usuario --password=$password $baseDatos > $archivoBackup

# COMPROBAMOS SI SE HA CREADO EL BACKUP
if (Test-Path -Path $archivoBackup) {
    Write-Host "Backup creado exitosamente: $archivoBackup"
} else {
    Write-Host "Error al crear el backup."
}