import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {UiToolbarService} from 'ng-smn-ui';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(private titleService: Title, private toolbarService: UiToolbarService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.titleService.setTitle('Página não encontrada');
        this.toolbarService.set('Página não encontrada');

        this.toolbarService.activateTransparentToolbar();
    }

    ngOnDestroy() {
        this.toolbarService.deactivateTransparentToolbar();
    }
}
