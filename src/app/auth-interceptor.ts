import { HttpClient,HttpInterceptor,HttpRequest, HttpHandler,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService : AuthService) {

    }

    intercept(req : HttpRequest<any>, next : HttpHandler) {
        const authToken = this.authService.getToken();
        console.log("===InterceptorauthToken:"+authToken);

        if(authToken) {
            console.log("===InterceptorIf:"+authToken);
            const authRequest = req.clone({
                headers : req.headers.set('Authorization', authToken)
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        
        }
    }
}