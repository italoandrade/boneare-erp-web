import {Component} from '@angular/core';
import {TfyNotificationPop} from './notification-pop.provider';

@Component({
    selector: 'tfy-notification-pop-container',
    templateUrl: './notification-pop-container.component.html',
    styleUrls: ['./notification-pop-container.component.scss']
})
export class TfyNotificationPopContainerComponent {
    bars: any[];

    constructor() {
        TfyNotificationPop.barsChange.subscribe((value) => {
            this.bars = value;
        });
    }
}
