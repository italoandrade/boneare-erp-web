import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {SMNUIModule} from 'ng-smn-ui';

import {TvshowCardComponent} from './tvshow-card.component';

@NgModule({
    imports: [
        SMNUIModule,
        BrowserModule
    ],
    exports: [TvshowCardComponent],
    declarations: [TvshowCardComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TvshowCardModule {
}
