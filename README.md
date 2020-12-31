# MAESTRO front-end

This repo contains the front-end source code of [MAESTRO (dynaMic bAyESian neTwoRks Online)](https://vascocandeias.github.io/maestro), a website for multivariate time series analysis using dynamic Bayesian networks. You may use this source code to adapt to your own version.

The publicly available website was deployed in AWS, and the relevant code is available [here](https://github.com/vascocandeias/maestro-cloud). You can also find the on-premises back-end code [here](https://github.com/vascocandeias/maestro-backend), which can be used to deploy the website in a managed network. The front-end of the local version [may be easily customised](#instructions) and deployed either in the cloud or on-premises.

For a more detailed explanation of this architecture, you may read the resulting [article (available soon)](https://github.com/vascocandeias/maestro) or underlying [thesis (available soon)](https://github.com/vascocandeias/maestro).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Instructions

### Prerequisites

This project requires Angular to be [installed](https://angular.io/guide/setup-local). When deploying in AWS, you will also need to install [AWS Amplify](https://docs.amplify.aws/start/getting-started/installation/q/integration/angular) and set up both [storage](https://docs.amplify.aws/lib/storage/getting-started/q/platform/js) and [authentication](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js).

Finally, you should clone this repo or [download](https://api.github.com/repos/vascocandeias/maestro/zipball) and unzip the source code.

### Development server

When developing, you may run a development server to test the application, which will run on `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Cloud

Run `ng serve`.

#### On-premises

Run `ng serve -c=local`.

### Production deployment

In both cases, the build artifacts will be stored in the `dist/` directory.

#### Cloud

Run `ng build`.

You may also want to deploy to GitHub Pages. To do so:
1. Add the `gh-pages` branch to your repo.
2. Run `ng deploy --base-href=/<repositoryname>/`.
3. In future deployments, you may use only `ng deploy`.

#### On-premises

You need to first have the [back-end](https://github.com/vascocandeias/maestro-backend) deployed. Afterwards:

1. Run ```ng build -c=local-prod```. 
2. Copy the files inside ```dist/``` to the back-end's ```gateway/maestro/``` directory.
3. Clean the browser's cache and refresh it.

### Further help

To get more help on the Angular CLI use `ng help`, check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md) or visit the [documentation](https://angular.io/docs).
