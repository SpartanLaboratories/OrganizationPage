# OrganizationPage

This repository includes an automated GitHub Actions pipeline for deploying the site to Spaceship hosting.

## Deployment workflow

The workflow lives in `.github/workflows/deploy-spaceship.yml` and runs automatically on pushes to `main`. It can also be started manually from the **Actions** tab with optional dry-run and clean-deploy inputs.

During deployment the workflow:

1. Installs Node dependencies when a `package.json` file exists
2. Runs `npm run build` when a build script is defined
3. Uses `SPACESHIP_APP_DIR` when the site source and build files live in a subdirectory
4. Uses `SPACESHIP_LOCAL_DIR` when you want to deploy a specific folder
5. Otherwise deploys the most recently updated publish directory from `dist`, `build`, or `out`
6. Falls back to common static site files in the configured app directory only when `index.html` exists

## Required GitHub secrets

Add these repository secrets before using the pipeline:

- `SPACESHIP_FTP_SERVER`
- `SPACESHIP_FTP_USERNAME`
- `SPACESHIP_FTP_PASSWORD`

## Optional GitHub repository variables

You can customize the deployment target with these repository variables:

- `SPACESHIP_APP_DIR` - directory inside the repository that contains the app source and optional `package.json`, defaults to `.`
- `SPACESHIP_LOCAL_DIR` - folder inside `SPACESHIP_APP_DIR` to deploy, such as `dist`, `build`, `.`, or `static-export`; it should contain the final site files to publish
- `SPACESHIP_REMOTE_DIR` - remote directory to upload into, defaults to `/`
- `SPACESHIP_FTP_PROTOCOL` - FTP protocol, defaults to `ftps`
- `SPACESHIP_FTP_PORT` - FTP port, defaults to `21` for `ftp` and `ftps`, or `990` for `ftps-legacy`
- `SPACESHIP_FTP_TIMEOUT` - timeout in milliseconds for FTP operations, defaults to `90000`
