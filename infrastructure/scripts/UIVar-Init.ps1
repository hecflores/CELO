
$env:DatabaseName = $env:DatabaseName -replace "[^\w\d_]",""
Write-Host "##vso[task.setvariable variable=DatabaseName]$env:DatabaseName"

$env:Host = $env:Host -replace "refs\/heads\/",""
$env:Host = $env:Host -replace "[\/]","-"
Write-Host "##vso[task.setvariable variable=Host]$env:Host"

$date = Get-Date -Format g 
Write-Host "##vso[task.setvariable variable=Timestamp]$date"


$env:Host = $env:Host -replace "\/","."
Write-Host "##vso[task.setvariable variable=Host]$env:Host"