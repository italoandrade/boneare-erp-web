import {Component, Input} from '@angular/core';

@Component({
    selector: 'tfy-notification-pop',
    templateUrl: './notification-pop.component.html',
    styleUrls: ['./notification-pop.component.scss']
})
export class TfyNotificationPopComponent {
    @Input() bar;

    constructor() {
    }
}
