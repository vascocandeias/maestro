# MAESTRO front-end

This repo contains the front-end source code of [MAESTRO (dynaMic bAyESian neTwoRks Online)](https://vascocandeias.github.io/maestro), a website for multivariate time series analysis using dynamic Bayesian networks. You may use this source code to adapt to your own version.

The publicly available website was deployed in AWS, and the relevant code is available [here](https://github.com/vascocandeias/maestro-cloud). You can also find the on-premises back-end code [here](https://github.com/vascocandeias/maestro), which can be used to deploy the website in a managed network. The front-end of the local version [may be easily customised](#changing-the-front-end) and deployed either in the cloud or on-premises.

For a more detailed explanation of this architecture, you may read the resulting [article (available soon)](https://github.com/vascocandeias/maestro) or underlying [thesis (available soon)](https://github.com/vascocandeias/maestro).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Instructions

### Prerequisites

This project requires Angular to be [installed](https://angular.io/guide/setup-local). When deploying in AWS, you will also need to install [AWS Amplify](https://docs.amplify.aws/start/getting-started/installation/q/integration/angular) and set up both [storage](https://docs.amplify.aws/lib/storage/getting-started/q/platform/js) and [authentication](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js).

### Development server

#### On-premises

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Cloud

### Deploy

#### On-premises

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Cloud

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
