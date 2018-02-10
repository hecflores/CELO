Params(
   [string]$phpPath

)
function Download-Installer {
    param(
        [string] $tmp,
        [int] $retry = 5
    )

    $installerPath = $tmp + "\composer-installer.php"
    if (Test-Path $installerPath) {
        return $installerPath
    }
    if (!(Test-Path -PathType container $tmp)) {
        mkdir -Force $tmp
    }

    Write-Host "Downloading composer installer ..."
    $installerURL = "https://getcomposer.org/installer"
    Invoke-WebRequest $installerURL -OutFile $installerPath
    if ($retry -gt 0) {
        $next = $retry - 1
        return (Download-Installer $tmp $next)
    }
    throw "Failed to download $installerURL"
}

function Install-Composer {
    param (
        [string] $tmp,
        [string] $dir,
        [int] $retry = 3
    )

    if (!(Get-Command -Name PHP 2>&1)) {
        throw "Please install PHP into your computer (Cannot find 'PHP' from PATH)"
    }

    $phar = $dir + "\composer.phar"
    if (Test-Path $phar) {
        return $phar
    }

    $installerPath = (Download-Installer $tmp)
    $installerLog  = $tmp + "\composer-installer.log"
    Write-Host "Installing composer.phar ..."
    Push-Location $dir
    &$phpPath $installerPath > $installerLog
    Pop-Location
    if (Test-Path $phar) {
        return $phar
    } else {
        # Seems that $installPath is broken
        Write-Host -ForegroundColor Yellow "[NOTICE]"
        Write-Host "Composer installer seems to be broken."
        Remove-Item $installerPath
        $next = $retry - 1
        if ($next -gt 0) {
            return (Install-Composer $tmp $dir $next)
        }
        throw "Failed to install composer.phar"
    }
}

if (Test-Path $env:TMP) {
    $tmp = $env:TMP
} else {
    $tmp = "C:\Temp"
}
$dir = (Split-Path $MyInvocation.MyCommand.Path)

try {
    $phar = (Install-Composer $tmp $dir)
    &$phpPath $phar $args
} catch {
    Write-Host -ForegroundColor Red "[ERROR]"
    Write-Host $Error[0].Exception.Message
    Write-Host
}