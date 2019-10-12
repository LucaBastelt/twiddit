import { Injectable, Optional } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthStorage, OAuthResourceServerErrorHandler, OAuthModuleConfig } from 'angular-oauth2-oidc';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authStorage: OAuthStorage,
        private errorHandler: OAuthResourceServerErrorHandler,
        @Optional() private moduleConfig: OAuthModuleConfig
    ) { }

    private checkUrl(url: string): boolean {
        if (!this.moduleConfig || !this.moduleConfig.resourceServer || !this.moduleConfig.resourceServer.allowedUrls) {
            return false;
        }
        const found = this.moduleConfig.resourceServer.allowedUrls.find(u => url.startsWith(u));
        return !!found;
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url.toLowerCase();
        console.log('Intercepting HTTP Request to ' + url);
        if (!this.checkUrl(url)) { return next.handle(req); }
        console.log('Appending auth token');

        const token = this.authStorage.getItem('id_token');
        if (token) {
            const headers = req.headers.set('Authorization', 'Bearer ' + token);
            req = req.clone({ headers });
        }

        return next
            .handle(req)
            .pipe(catchError(err => this.errorHandler.handleError(err)));

    }
}
