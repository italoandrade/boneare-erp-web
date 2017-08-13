import {Component, OnInit, AfterViewInit, OnDestroy, ElementRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {UiToolbarService, UiCookie, UiSnackbar} from 'ng-smn-ui';

import {ApiService} from '../../../../core/api/api.service';
import {UserService} from '../../../../core/services/user.service';

@Component({
    selector: 'app-recover-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['../../signin.component.scss']
})
export class RecoverConfirmComponent implements OnInit, AfterViewInit, OnDestroy {
    showPassword: boolean;
    showConfirmPassword: boolean;
    info: any;
    submitting: boolean;
    token: any;

    constructor(private toolbarService: UiToolbarService,
                private titleService: Title,
                private api: ApiService,
                private router: Router,
                private route: ActivatedRoute,
                private userService: UserService,
                private element: ElementRef,
                private _location: Location) {
        if (UiCookie.get('RNB')) {
            this.router.navigate(['']);
        }
        this.info = {};
        this.token = this.route.snapshot.params['token'];
        try {
            this.token = atob(this.token);
            this.token = JSON.parse(this.token);
            this.info.email = this.token.email;
            this.info.token = this.token.token;
        } catch (e) {
            UiSnackbar.show({
                text: 'Não foi possível ler seu token de recuperação de senha',
                actionText: 'OK',
                duration: Infinity,
                action: close => close()
            });
            this.router.navigate(['/recover']);
        }
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.titleService.setTitle('Recuperar conta');
        this.toolbarService.set('Recuperar conta');

        this.toolbarService.activateTransparentToolbar();

        this.element.nativeElement.querySelectorAll('input[name="password"]')[0].focus();
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

            if (this.info.password !== this.info.confirmPassword) {
                this.element.nativeElement.querySelectorAll('input[name="confirmPassword"]')[0].focus();
                form.controls['confirmPassword'].setErrors({wrongConfirmation: true});
                return false;
            }

            if (!form.valid) {
                this.element.nativeElement.querySelectorAll('form .ng-invalid')[0].focus();
                return false;
            }

            this.submitting = true;

            this.api
                .prep('user', 'recoverConfirm')
                .call(this.info)
                .subscribe(
                    (data) => {
                        UiSnackbar.show({
                            text: 'Senha alterada com sucesso',
                            actionText: 'OK',
                            duration: Infinity,
                            action: close => close()
                        });
                        UiCookie.set('RNB', data.token);
                        this.userService.set(data);
                        this.router.navigate(['']);
                    }, (error) => {
                        this.submitting = false;
                        switch (error.executionCode) {
                            case 1:
                                this.element.nativeElement.querySelectorAll('input[name="confirmPassword"]')[0].focus();
                                form.controls['confirmPassword'].setErrors({wrongConfirmation: true});
                                break;
                            case 2:
                                UiSnackbar.show({
                                    text: 'Seu token de recuperação de conta expirou',
                                    actionText: 'OK',
                                    duration: Infinity,
                                    action: close => close()
                                });
                                this.router.navigate(['/recover']);
                                break;
                        }
                    }
                );
        }
    }

    goBack(e) {
        e.preventDefault();
        if (sessionStorage.getItem('goBack')) {
            sessionStorage.removeItem('goBack');
            this._location.back();
        } else {
            this.router.navigate(['/signin']);
        }
    }
}
