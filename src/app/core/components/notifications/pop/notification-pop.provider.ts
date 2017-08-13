import {EventEmitter, Injectable} from '@angular/core';

let timeout: any;
const bars: any[] = [];
const defaults: {} = {
    duration: 5000,
    center: false,
    actionText: null
};

@Injectable()
export class TfyNotificationPop {
    static barsChange: EventEmitter<any> = new EventEmitter();

    static show(bar) {
        bar = Object.assign({}, defaults, bar);
        bars.push(bar);
        if (bars.length === 1) {
            this.timerBar(bar);
        }
        this.barsChange.emit(bars);
    }

    private static timerBar(bar) {
        if (bars.length) {
            timeout = setTimeout(() => {
                document.querySelectorAll('tfy-notification-pop-container > tfy-notification-pop')[0].classList.add('leave');
                setTimeout(() => this.finishTimeout(), 280);
            }, bar.duration);
        }
    };

    private static finishTimeout() {
        bars.shift();
        if (bars.length) {
            this.timerBar(bars[0]);
        }
        this.barsChange.emit(bars);
    }

    constructor() {
    }
}
