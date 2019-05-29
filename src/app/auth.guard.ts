import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { AuthService } from './auth.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService : AuthService, private router : Router) {

    }

    canActivate(route: import("@angular/router").ActivatedRouteSnapshot, 
    state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        const isAuth = this.authService.getLoginStatus();
        if (!isAuth) {
            this.router.navigate(['']);
        }
        return true;
    }

}