import {
    Component,
    ElementRef,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
    EventEmitter, Input, OnDestroy
} from '@angular/core';
import {Router} from '@angular/router';
import {animate, sequence, style, transition, trigger} from '@angular/animations';

import {ApiService} from '../../api/api.service';
import {UiSnackbar} from 'ng-smn-ui';
import {TfyNotificationPop} from './pop/notification-pop.provider';

@Component({
    selector: 'tfy-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('notification', [
            transition('* => void', [
                style({maxHeight: '200px', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
                sequence([
                    animate('.25s ease', style({maxHeight: '200px', opacity: '.2', transform: 'translateX(100%)', 'box-shadow': 'none'})),
                    animate('.1s ease', style({maxHeight: '0', opacity: 0, transform: 'translateX(100%)', 'box-shadow': 'none'}))
                ])
            ]),
            transition('void => *', [
                style({maxHeight: '0', opacity: '0'}),
                sequence([
                    animate('.1s ease', style({maxHeight: '200px', opacity: '.2'})),
                    animate('.35s ease', style({
                        maxHeight: '200px',
                        opacity: 1
                    }))
                ])
            ])
        ])
    ]
})
export class TfyNotificationsComponent implements OnDestroy {
    @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
    @Output() closeChange: EventEmitter<any> = new EventEmitter();
    opened: boolean;
    @Input() user: any;
    loading: boolean;
    noMore: boolean;
    verify: any;

    constructor(public elementRef: ElementRef, private api: ApiService, private router: Router) {
        this.verify = setInterval(() => {
            this.api
                .prep('notifications', 'recheck')
                .call()
                .subscribe(data => {
                    const difference = data.unreadNotifications - this.user.unreadNotifications;
                    if (difference > 0) {
                        TfyNotificationPop.show({
                            text: `Você recebeu ${difference === 1 ? 'uma nova notificação' : 'novas notificações'}`,
                        });
                    }
                    Object.assign(this.user, data);
                });
        }, 60000);
    }

    ngOnDestroy() {
        clearInterval(this.verify);
    }

    close() {
        this.closeChange.emit();
    }

    dismiss(item) {
        this.api
            .prep('notifications', 'dismiss')
            .call({
                id: item.id
            })
            .subscribe(() => {
                const notification = this.user.notifications.indexOf(item);

                if (notification > -1) {
                    this.user.notifications.splice(notification, 1);
                }

                UiSnackbar.show({
                    text: 'Notificação dispensada',
                    actionText: 'Desfazer',
                    action: close => {
                        this.restore(item);
                        close();
                    },
                });
            });
    }

    markAllAsRead() {
        if (this.user.unreadNotifications) {
            this.api
                .prep('notifications', 'markAllAsRead')
                .call()
                .subscribe(() => {
                    this.user.unreadNotifications = null;
                });
        }
    }

    loadMore() {
        if (!this.loading && !this.noMore) {
            this.loading = true;
            this.api
                .prep('notifications', 'select')
                .call({
                    unless: this.user.notifications.map(item => item.id)
                })
                .subscribe(data => {
                    this.loading = false;

                    if (data.length) {
                        this.user.notifications = [...this.user.notifications, ...data];
                    } else {
                        this.noMore = true;
                    }
                });
        }
    }

    open(item) {
        const notification = this.user.notifications.indexOf(item);

        if (notification > -1) {
            this.user.notifications.splice(notification, 1);
        }

        if (item.url) {
            this.router.navigateByUrl(item.url);
            this.close();
        }
        this.api
            .prep('notifications', 'markOpen')
            .call({
                id: item.id
            });
    }

    restore(item) {
        this.api
            .prep('notifications', 'restore')
            .call({
                id: item.id
            })
            .subscribe(() => {
                this.user.notifications.unshift(item);
            });
    }
}
