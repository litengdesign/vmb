import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  // Url of the Identity Provider
  // issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
  issuer:"http://10.9.53.82:5100",

  // URL of the SPA to redirect the user to after login
  redirectUri:'http://localhost:8086/',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'spa-demo',
  clientId:'client_api_swagger',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  // scope: 'openid profile email voucher',
  scope: 'api_swagger',
}