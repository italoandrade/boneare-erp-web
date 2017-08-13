import {Component, AfterViewInit, OnDestroy, OnInit, ElementRef} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {UiToolbarService, UiSnackbar} from 'ng-smn-ui';

import {ApiService} from '../../../core/api/api.service';

@Component({
    selector: 'app-client-list',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})

export class ClientInfoComponent implements AfterViewInit, OnDestroy, OnInit {
    info: any;
    typesClient: any;
    typesRecurring: any;
    regions: any;
    saving: boolean;
    deleting: boolean;
    addingNew: boolean;
    loading = true;

    constructor(private toolbarService: UiToolbarService,
                private api: ApiService,
                private _location: Location,
                private router: Router,
                private route: ActivatedRoute,
                private element: ElementRef) {
        this.info = {
            phones: [],
            emails: []
        };
        this.typesClient = [];
        this.typesRecurring = [];
        this.regions = [];
    }

    ngOnInit() {
        this.toolbarService.set('Cliente');
        this.toolbarService.activateExtendedToolbar(960);

        if (this.route.snapshot.params['id']) {
            setTimeout(() => {
                this.addingNew = false;
            });
            this.getInfo();
        } else {
            setTimeout(() => {
                this.addingNew = true;
                this.loading = false;
            });
        }
        this.getTypesClient();
        this.getRegions();
        this.getTypesRecurring();
    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //     this.info = {
        //         phones: [
        //             {
        //                 phone: '1637039535',
        //                 description: 'Casa'
        //             }
        //         ],
        //         emails: [
        //             {
        //                 email: 'italo@boneare.com',
        //                 description: 'Comercial'
        //             }
        //         ],
        //         recurringOrder: true,
        //         recurringDate: '15',
        //         typeRecurringId: 1,
        //         typeId: 1,
        //         name: 'Boneare',
        //         razaoSocial: 'Boneare Social',
        //         contactName: 'Italo',
        //         cnpj: '24364775000104',
        //         regionId: 1,
        //         inscricaoEstadual: '15454',
        //         address: 'Genaldo'
        //     };
        // }, 1000);
    }

    getInfo() {
        this.api
            .prep('client', 'selectById')
            .call({
                id: this.route.snapshot.params['id']
            })
            .subscribe(data => {
                Object.assign(this.info, data);

                this.loading = false;
            }, error => {
                switch (error.executionCode) {
                    case 1:
                        UiSnackbar.show({
                            text: error.message
                        });
                        this.goBack();
                        break;
                }
            });
    }

    getTypesClient() {
        this.api
            .prep('typeClient', 'select')
            .call()
            .subscribe((data) => {
                this.typesClient = data;
                this.typesClient.loaded = true;
            });
    }

    getTypesRecurring() {
        this.api
            .prep('typeRecurring', 'select')
            .call()
            .subscribe((data) => {
                this.typesRecurring = data;
                this.typesRecurring.loaded = true;
            });
    }

    getRegions() {
        this.api
            .prep('regions', 'select')
            .call()
            .subscribe((data) => {
                this.regions = data;
                this.regions.loaded = true;
            });
    }

    ngOnDestroy() {
        this.toolbarService.deactivateExtendedToolbar();
    }

    goBack() {
        if (sessionStorage.getItem('goBack')) {
            this._location.back();
        } else {
            this.router.navigate(['/client']);
        }
    }

    onSubmit(form) {
        if (!this.saving) {
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

            this.saving = true;

            if (this.addingNew) {
                this.api
                    .prep('client', 'insert')
                    .call(this.info)
                    .subscribe((data) => {
                        this.router.navigate(['/client/', data.id]);
                        this.router.navigate(['/client']);
                        UiSnackbar.show({
                            text: 'Cliente inserido com sucesso'
                        });
                    }, (error) => {
                        this.saving = false;
                        switch (error.executionCode) {
                            case 1:
                                setTimeout(() => {
                                    this.element.nativeElement.querySelectorAll('input[name="cnpj"]')[0].focus();
                                });
                                form.controls['cnpj'].setErrors({existingCnpj: true});
                                break;
                        }
                    });
            } else {
                this.api
                    .prep('client', 'update')
                    .call(this.info)
                    .subscribe(() => {
                        this.router.navigate(['/client']);
                        UiSnackbar.show({
                            text: 'Cliente alterado com sucesso'
                        });
                    }, (error) => {
                        this.saving = false;
                        switch (error.executionCode) {
                            case 2:
                                this.element.nativeElement.querySelectorAll('input[name="logon"]')[0].focus();
                                form.controls['logon'].setErrors({existingLogon: true});
                                break;
                            case 3:
                                this.element.nativeElement.querySelectorAll('input[name="idSuperior"]')[0].focus();
                                form.controls['idSuperior'].setErrors({notFound: true});
                                UiSnackbar.show({
                                    text: 'Usuário superior não encontrado. Verifique se ele não foi excluído.'
                                });
                                break;
                            case 4:
                                this.element.nativeElement.querySelectorAll('input[name="idGrupo"]')[0].focus();
                                form.controls['idGrupo'].setErrors({notFound: true});
                                UiSnackbar.show({
                                    text: 'Grupo não encontrado. Verifique se ele não foi excluído.'
                                });
                                break;
                            case 5:
                            case 1:
                                UiSnackbar.show({
                                    text: error.message
                                });
                        }
                    });
            }
        }
    }

    confirmDelete() {
        if (!this.deleting) {
            this.deleting = true;

            this.api
                .prep('client', 'delete')
                .call({
                    id: this.info.id
                })
                .subscribe(() => {
                    this.router.navigate(['/client']);
                    UiSnackbar.show({
                        text: 'Cliente excluído com sucesso'
                    });
                }, (error) => {
                    this.deleting = false;
                    switch (error.executionCode) {
                        case 1:
                            UiSnackbar.show({
                                text: 'Cliente não encontrado. Verifique se ele já não foi excluído.'
                            });
                            break;
                    }
                });
        }
    }
}
