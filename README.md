# OrganizationPage

This repository includes an automated GitHub Actions pipeline for deploying the site to Spaceship hosting.

## Deployment workflow

The workflow lives at `/home/runner/work/OrganizationPage/OrganizationPage/.github/workflows/deploy-spaceship.yml` and runs automatically on pushes to `main`. It can also be started manually from the **Actions** tab with optional dry-run and clean-deploy inputs.

During deployment the workflow:

1. Installs Node dependencies when a `package.json` file exists
2. Runs `npm run build` when a build script is defined
3. Deploys the first available publish directory from `dist`, `build`, `out`, or `public`
4. Falls back to deploying static site files from the repository root when no build output directory exists

## Required GitHub secrets

Add these repository secrets before using the pipeline:

- `SPACESHIP_FTP_SERVER`
- `SPACESHIP_FTP_USERNAME`
- `SPACESHIP_FTP_PASSWORD`

## Optional GitHub repository variables

You can customize the deployment target with these repository variables:

- `SPACESHIP_REMOTE_DIR` - remote directory to upload into, defaults to `/`
- `SPACESHIP_FTP_PROTOCOL` - FTP protocol, defaults to `ftps`
- `SPACESHIP_FTP_PORT` - FTP port, defaults to `21`
