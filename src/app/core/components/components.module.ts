import {NgModule} from '@angular/core';

import {NotificationsModule} from './notifications/notifications.module';
import {TvshowCardModule} from './tvshow-card/tvshow-card.module';

@NgModule({
    exports: [
        NotificationsModule,
        TvshowCardModule
    ]
})
export class ComponentsModule {
}
