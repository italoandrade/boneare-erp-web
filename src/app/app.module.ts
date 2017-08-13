import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {SharedModule} from './shared.module';
import {AppRoutingModule} from './app-routing.module';

import {ApiService} from './core/api/api.service';
import {AuthGuard} from './core/guard/auth.guard';
import {UserService} from './core/services/user.service';

import {SignInModule} from './views/signin/signin.module';
import {NotFoundModule} from './views/not-found/not-found.module';
import {HomeModule} from './views/home/home.module';
import {ClientModule} from './views/client/client.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        SharedModule,

        SignInModule,
        HomeModule,
        NotFoundModule,
        ClientModule,

        AppRoutingModule
    ],
    providers: [
        ApiService,
        AuthGuard,
        UserService,
        {provide: LOCALE_ID, useValue: 'pt-BR'}
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
