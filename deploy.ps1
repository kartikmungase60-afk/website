param(
    [string]$Username = "root",
    [string]$IP = "51.79.250.67",
    [string]$TargetDir = "/var/www/hostlixo"
)

Write-Host "Building the Next.js app locally..." -ForegroundColor Cyan
npm run build

Write-Host "Ensuring the target directory exists on the VPS..." -ForegroundColor Cyan
ssh $Username@$IP "mkdir -p $TargetDir"

Write-Host "Uploading necessary files to VPS..." -ForegroundColor Cyan
scp package.json package-lock.json "$Username@${IP}:$TargetDir"
scp -r public "$Username@${IP}:$TargetDir"
scp -r .next "$Username@${IP}:$TargetDir"

Write-Host "Installing production dependencies and starting the app via PM2 on VPS..." -ForegroundColor Cyan
ssh $Username@$IP "cd $TargetDir && npm install --production && pm2 restart hostlixo-website || pm2 start npm --name 'hostlixo-website' -- start"

Write-Host "Deployment Completed!" -ForegroundColor Green
