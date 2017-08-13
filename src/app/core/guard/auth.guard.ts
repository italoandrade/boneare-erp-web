import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UiCookie} from 'ng-smn-ui';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (UiCookie.get('RNB')) {
            return true;
        }

        this.router.navigate(['/signin']);
        return false;
    }
}
