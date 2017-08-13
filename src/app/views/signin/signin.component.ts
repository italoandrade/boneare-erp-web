import {Component, OnInit, AfterViewInit, OnDestroy, ElementRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';

import {UiToolbarService, UiCookie} from 'ng-smn-ui';

import {ApiService} from '../../core/api/api.service';
import {UserService} from '../../core/services/user.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SignInComponent implements OnInit, AfterViewInit, OnDestroy {
    showPassword: boolean;
    info: any;
    submitting: boolean;

    constructor(private toolbarService: UiToolbarService,
                private titleService: Title,
                private api: ApiService,
                private router: Router,
                private userService: UserService,
                private element: ElementRef) {
        if (UiCookie.get('RNB')) {
            this.router.navigate(['']);
        }
        this.info = {}
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.titleService.setTitle('Entrar');
        this.toolbarService.set('Entrar');

        this.toolbarService.activateTransparentToolbar();

        this.element.nativeElement.querySelectorAll('input[name="email"]')[0].focus();
    }

    ngOnDestroy() {
        this.toolbarService.deactivateTransparentToolbar();
    }

    onSubmit(form) {
        if (!this.submitting) {
            for (const control in form.controls) {
                if (form.controls.hasOwnProperty(control)) {
                    form.controls[control].markAsTouched();
                    form.controls[control].markAsDirty();
                }
            }

            if (!form.valid) {
                this.element.nativeElement.querySelectorAll('form .ng-invalid')[0].focus();
                return false;
            }

            this.submitting = true;

            this.api
                .prep('user', 'login')
                .call(this.info)
                .subscribe(
                    (data) => {
                        UiCookie.set('RNB', data.token);
                        this.userService.set(data);
                        this.router.navigate(['']);
                    }, (error) => {
                        this.submitting = false;
                        switch (error.executionCode) {
                            case 1:
                                this.element.nativeElement.querySelectorAll('input[name="email"]')[0].focus();
                                form.controls['email'].setErrors({notFound: true});
                                break;
                            case 2:
                                this.element.nativeElement.querySelectorAll('input[name="password"]')[0].focus();
                                form.controls['password'].setErrors({wrongPassword: true});
                        }
                    }
                );
        }
    }

    goToSignUp(e) {
        e.preventDefault();
        sessionStorage.setItem('goBack', 'true');
        this.router.navigate(['/signup']);
    }

    goToRecover(e) {
        e.preventDefault();
        sessionStorage.setItem('goBack', 'true');
        this.router.navigate(['/recover']);
    }
}
/**/
