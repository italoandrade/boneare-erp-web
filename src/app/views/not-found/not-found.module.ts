import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {SharedModule} from '../../shared.module';
import {NotFoundRoutingModule} from './not-found-routing.module';

import {NotFoundComponent} from './not-found.component';

@NgModule({
    imports: [
        SharedModule,
        NotFoundRoutingModule
    ],
    declarations: [
        NotFoundComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotFoundModule {
}
