import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  issuer: 'https://accounts.google.com',

  redirectUri: "http://localhost:4200/profile",

  clientId: '414204751026-dbnq144013c93n2mmq59duefnfbmct2r.apps.googleusercontent.com',

  scope: 'openid profile email',

  strictDiscoveryDocumentValidation: false,

};