import {Component, OnInit, AfterViewInit, OnDestroy, ElementRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {UiToolbarService, UiCookie, UiSnackbar} from 'ng-smn-ui';

import {ApiService} from '../../../core/api/api.service';

@Component({
    selector: 'app-recover',
    templateUrl: './recover.component.html',
    styleUrls: ['../signin.component.scss']
})
export class RecoverComponent implements OnInit, AfterViewInit, OnDestroy {
    info: any;
    submitting: boolean;

    constructor(private toolbarService: UiToolbarService,
                private titleService: Title,
                private api: ApiService,
                private router: Router,
                private element: ElementRef,
                private _location: Location) {
        if (UiCookie.get('RNB')) {
            this.router.navigate(['']);
        }
        this.info = {};
    }

    ngOnInit() {
        this.info.email = sessionStorage.getItem('emailToRecover');
        sessionStorage.removeItem('emailToRecover');
    }

    ngAfterViewInit() {
        this.titleService.setTitle('Recuperar conta');
        this.toolbarService.set('Recuperar conta');

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
                .prep('user', 'recover')
                .call(this.info)
                .subscribe(
                    () => {
                        UiSnackbar.show({
                            text: 'E-mail de recuperação enviado com sucesso. Cheque sua caixa de entrada.',
                            actionText: 'OK',
                            duration: Infinity,
                            action: close => close()
                        });
                        this.submitting = false;
                    }, (error) => {
                        this.submitting = false;
                        switch (error.executionCode) {
                            case 1:
                                this.element.nativeElement.querySelectorAll('input[name="email"]')[0].focus();
                                form.controls['email'].setErrors({notFound: true});
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
/**/
