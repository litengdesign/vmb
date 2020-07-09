import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
// export const authConfig: AuthConfig = {

//     // Url of the Identity Provider
//     issuer: 'https://steyer-identity-server.azurewebsites.net/identity',

//     // URL of the SPA to redirect the user to after login
//     redirectUri: window.location.origin + '/index.html',

//     // The SPA's id. The SPA is registerd with this id at the auth-server
//     clientId: 'spa-demo',

//     // set the scope for the permissions the client should request
//     // The first three are defined by OIDC. The 4th is a usecase-specific one
//     scope: 'openid profile email voucher',
//     dummyClientSecret: 'geheim',
// }
export const authConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'http://47.102.121.205:5100',
    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin + '/#/home?',
    postLogoutRedirectUri: window.location.origin + '/#/home?',
    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: environment.clientId,
    // clientId:'gis_release',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile api_angular',
    requireHttps: false,
};
