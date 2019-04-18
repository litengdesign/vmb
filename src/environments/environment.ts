// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { WebStorageStateStore } from 'oidc-client';
export const environment = {
  production: false,
  evnName: 'dev',
  API: 'http://10.9.53.82:8009/api/',
  projectUrl: 'http://10.9.53.82:8009/',
  authConfig: {
    authority: 'http://localhost:5000',
    client_id: 'sales',
    redirect_uri: 'http://localhost:4200/login-callback',
    response_type: 'id_token token',
    scope: 'openid profile salesapi email',
    post_logout_redirect_uri: 'http://localhost:4200',

    silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTime: 4,
    // silentRequestTimeout:10000,
    userStore: new WebStorageStateStore({ store: window.localStorage })
  },
  salesApiBase: 'http://localhost:5100/api/sales/',
  themeKey: 'MLHSalesApiClientThemeKeyForDevelopment'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
