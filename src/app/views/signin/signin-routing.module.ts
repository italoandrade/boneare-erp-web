import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SignInComponent} from './signin.component';
import {RecoverComponent} from './recover/recover.component';
import {RecoverConfirmComponent} from './recover/confirm/confirm.component';

const routes: Routes = [
    {path: 'signin', component: SignInComponent},
    {path: 'recover', component: RecoverComponent},
    {path: 'recover/:token', component: RecoverConfirmComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SigninRoutingModule {
}
