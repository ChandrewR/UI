import { HttpClient,HttpInterceptor,HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';
/* import { AuthService } from './auth.service'; */

 @Injectable() 
export class ErrorInterceptor implements HttpInterceptor {

     constructor(private dialog : MatDialog) {

    } 

    intercept(req : HttpRequest<any>, next : HttpHandler) {
        //const authToken = this.authService.getToken();
        //console.log("===InterceptorauthToken:"+authToken);

        /* if(authToken) {
            console.log("===InterceptorIf:"+authToken);
            const authRequest = req.clone({
                headers : req.headers.set('Authorization', authToken)
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        
        } */

        return next.handle(req).pipe(catchError((error : HttpErrorResponse) => {
            console.log("=======>>>><<<<<<<<"+error);
            let errorMessage = "An unknown error occurred";
             if(error.error.result.error.message) {
                errorMessage = error.error.result.error.message;
            }
            this.dialog.open(ErrorComponent, {
                data : {
                    message : errorMessage
                }
            });
            return throwError(error);
        }));
    }
}