import { Injectable } from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from '../../auth.config';
import { Observable } from 'rxjs';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private oauthService: OAuthService, private router: Router) { }

    canActivate(): Promise<boolean> {
        return this.oauthService
            .loadDiscoveryDocumentAndTryLogin()
            .then((res) => {
                return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()
            });
    }
}