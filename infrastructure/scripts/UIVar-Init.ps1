

$env:Build_SourceBranch = $env:Build_SourceBranch -replace "refs\/heads\/",""

$env:BranchNameWithUnderscore = $env:Build_SourceBranch
$env:BranchNameWithPeriods    = $env:Build_SourceBranch
$env:EnvironmentNameWithUnderscore = $env:Release_EnvironmentName
$env:EnvironmentNameWithPeriods = $env:Release_EnvironmentName

$env:BranchNameWithPeriods = $env:BranchNameWithPeriods -replace "\/","."
$env:BranchNameWithUnderscore = $env:BranchNameWithUnderscore -replace "\/","_"
$env:BranchNameWithUnderscore = $env:BranchNameWithUnderscore -replace "[^\w\d_]","_"
Write-Host "##vso[task.setvariable variable=BranchNameWithUnderscore]$env:BranchNameWithUnderscore"
Write-Host "##vso[task.setvariable variable=BranchNameWithPeriods]$env:BranchNameWithPeriods"

$env:EnvironmentNameWithPeriods = $env:EnvironmentNameWithPeriods -replace "\/","."
$env:EnvironmentNameWithUnderscore = $env:EnvironmentNameWithUnderscore -replace "\/","_"
$env:EnvironmentNameWithUnderscore = $env:EnvironmentNameWithUnderscore -replace "[^\w\d_]","_"
Write-Host "##vso[task.setvariable variable=EnvironmentNameWithUnderscore]$env:EnvironmentNameWithUnderscore"
Write-Host "##vso[task.setvariable variable=EnvironmentNameWithPeriods]$env:EnvironmentNameWithPeriods"

$date = Get-Date -Format g 
Write-Host "##vso[task.setvariable variable=Timestamp]$date"

