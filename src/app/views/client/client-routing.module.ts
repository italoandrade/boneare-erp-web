import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ClientComponent} from './client.component';
import {ClientListComponent} from './list/list.component';
import {ClientInfoComponent} from './info/info.component';
import {AuthGuard} from '../../core/guard/auth.guard';

const routes: Routes = [
    {
        path: 'client', component: ClientComponent, canActivate: [AuthGuard],
        children: [
            {path: '', component: ClientListComponent},
            {path: 'new', component: ClientInfoComponent},
            {path: ':id', component: ClientInfoComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule {
}
