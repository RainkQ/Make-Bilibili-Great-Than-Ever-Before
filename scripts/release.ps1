[CmdletBinding()]
param (
    # If specified, will delete remote and local tags before re-tagging and pushing.
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Stop script on first error
$ErrorActionPreference = "Stop"

try {
    # 1. Read version from package.json
    $packageJsonPath = ".\package.json"
    if (-not (Test-Path $packageJsonPath)) {
        throw "package.json not found in the current directory."
    }
    $packageJson = Get-Content -Path $packageJsonPath -Raw | ConvertFrom-Json
    $version = $packageJson.version
    if ([string]::IsNullOrWhiteSpace($version)) {
        throw "Version field is empty or not found in package.json"
    }
    $tagName = "v$version"

    Write-Host "Version: $version"
    Write-Host "Tag:     $tagName"

    # 2. Check for uncommitted changes
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Warning "You have uncommitted changes. It's recommended to commit them before releasing."
        # In a real-world scenario, you might want to prompt the user to continue or exit here.
    }

    # 3. Handle force push logic
    if ($Force.IsPresent) {
        Write-Host "Force mode: Deleting existing tags..."
        
        # Delete remote tag if it exists
        if (git ls-remote --exit-code --tags origin $tagName) {
            Write-Host "Deleting remote tag $tagName..."
            git push origin --delete $tagName
        } else {
            Write-Host "Remote tag $tagName not found. Skipping remote deletion."
        }

        # Delete local tag if it exists
        if (git tag -l $tagName) {
            Write-Host "Deleting local tag $tagName..."
            git tag -d $tagName
        } else {
            Write-Host "Local tag $tagName not found. Skipping local deletion."
        }
    }

    # 4. Create new local tag
    Write-Host "Creating local tag $tagName..."
    git tag $tagName

    # 5. Push the new tag
    Write-Host "Pushing tag $tagName to remote..."
    git push origin $tagName

    Write-Host "`nSuccessfully pushed tag $tagName."
    Write-Host "GitHub Actions release workflow should now be triggered."

} catch {
    Write-Error $_.Exception.Message
    exit 1
}
