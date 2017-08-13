import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {RouterModule} from '@angular/router';
import {SMNUIModule} from 'ng-smn-ui';
import {BrowserModule} from '@angular/platform-browser';

import {TfyNotificationsComponent} from './notifications.component';
import {TfyNotificationsTriggerDirective} from './notifications-trigger.directive';
import {TfyNotificationPopComponent} from './pop/notification-pop.component';
import {TfyNotificationPopContainerComponent} from './pop/notification-pop-container.component';
import {TfyNotificationPop} from './pop/notification-pop.provider';

const exportsAndDeclarations: [any] = [
    TfyNotificationsTriggerDirective,
    TfyNotificationsComponent,
    TfyNotificationPopComponent,
    TfyNotificationPopContainerComponent
];

@NgModule({
    imports: [
        SMNUIModule,
        RouterModule,
        BrowserModule
    ],
    exports: exportsAndDeclarations,
    declarations: exportsAndDeclarations,
    providers: [
        TfyNotificationPop
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsModule {
}
