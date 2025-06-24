# Use timestamp as version
$VERSION = Get-Date -Format "yyyyMMdd-HHmmss"

# Get and changescript directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR
Write-Host "Current directory: $SCRIPT_DIR"

# Image name
$IMAGE_NAME = "akkt1-g1-consumer"
$REGISTRY = "ghcr.io/mcce2024"

# Check if already logged in to ghcr.io
$dockerConfig = "$env:USERPROFILE\.docker\config.json"
$isLoggedIn = $false

if (Test-Path $dockerConfig) {
    $config = Get-Content $dockerConfig -Raw | ConvertFrom-Json
    if ($config.auths.'ghcr.io') {
        Write-Host "Already logged in to ghcr.io"
        $isLoggedIn = $true
    }
}

if (-not $isLoggedIn) {
    # Get token from parallel directory
    $TOKEN_PATH = Join-Path -Path (Split-Path -Parent $SCRIPT_DIR) -ChildPath "token"
    $GITHUB_TOKEN = Get-Content -Path $TOKEN_PATH -Raw
    if (-not $GITHUB_TOKEN) {
        Write-Host "Could not read GitHub token from '$TOKEN_PATH' file"
        exit 1
    }
    Write-Host $GITHUB_TOKEN.Trim() | docker login ghcr.io -u mcce2024 --password-stdin
}

Write-Host "Building ${REGISTRY}/${IMAGE_NAME}:${VERSION}"

docker build -t "${REGISTRY}/${IMAGE_NAME}:${VERSION}" .
docker tag "${REGISTRY}/${IMAGE_NAME}:${VERSION}" "${REGISTRY}/${IMAGE_NAME}:latest"
docker push "${REGISTRY}/${IMAGE_NAME}:${VERSION}"
docker push "${REGISTRY}/${IMAGE_NAME}:latest"

# Logout from ghcr.io
docker logout ghcr.io
Write-Host "Logged out from ghcr.io"

Write-Host "Build complete!"
Write-Host "To run the image: docker run -p 3000:3000 ${IMAGE_NAME}:${VERSION}" 