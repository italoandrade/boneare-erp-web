import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {SMNUIModule, UiToolbarService, UiColor} from 'ng-smn-ui';
import {ComponentsModule} from './core/components/components.module';

@NgModule({
    imports: [],
    exports: [
        SMNUIModule,
        FormsModule,
        HttpModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        ComponentsModule
    ],
    declarations: [],
    providers: [
        UiToolbarService,
        UiColor
    ]
})
export class SharedModule {
}
