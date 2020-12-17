import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Amplify, { Auth, Storage } from 'aws-amplify';
import awsconfig from './aws-exports.js';
Amplify.configure(awsconfig);
Auth.configure(awsconfig);
Storage.configure({ 
  bucket: awsconfig.aws_user_files_s3_bucket, // needed for production
  region: awsconfig.aws_user_files_s3_bucket_region, // needed for production
  level: 'private',
  identityField: "sub"
});

if (environment.production) {
  enableProdMode();
  console.log = function () {};
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

