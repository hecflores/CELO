

$env:Build_SourceBranch = $env:Build_SourceBranch -replace "refs\/heads\/",""

$env:BranchNameWithUnderscore = $env:Build_SourceBranch
$env:BranchNameWithPeriods    = $env:Build_SourceBranch

$env:BranchNameWithPeriods = $env:BranchNameWithPeriods -replace "\/","."
$env:BranchNameWithUnderscore = $env:BranchNameWithUnderscore -replace "\/","_"
$env:BranchNameWithUnderscore = $env:BranchNameWithUnderscore -replace "[^\w\d_]","_"
Write-Host "##vso[task.setvariable variable=BranchNameWithUnderscore]$env:BranchNameWithUnderscore"
Write-Host "##vso[task.setvariable variable=BranchNameWithPeriods]$env:BranchNameWithPeriods"

$date = Get-Date -Format g 
Write-Host "##vso[task.setvariable variable=Timestamp]$date"

