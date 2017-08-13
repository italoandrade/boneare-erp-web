import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {SharedModule} from '../../shared.module';
import {ClientRoutingModule} from './client-routing.module';

import {ClientComponent} from './client.component';
import {ClientListComponent} from './list/list.component';
import {ClientInfoComponent} from './info/info.component';

@NgModule({
    imports: [
        SharedModule,
        ClientRoutingModule
    ],
    declarations: [
        ClientComponent,
        ClientListComponent,
        ClientInfoComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientModule {
}
