import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private oauthService: OAuthService) { }
    canActivate(): Promise<boolean> {
        return this.oauthService
            .loadDiscoveryDocumentAndTryLogin()
            .then((res) => {
                return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
            });
    }
}
