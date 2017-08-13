import {Injectable, EventEmitter} from '@angular/core';
import {ApiService} from '../api/api.service';

import {UiCookie, UiSnackbar} from 'ng-smn-ui';

@Injectable()
export class UserService {
    sharedValue: String;
    change: EventEmitter<any> = new EventEmitter();

    constructor(private api: ApiService) {
    }

    public get() {
        return this.sharedValue;
    }

    public set(sharedValue: String) {
        this.sharedValue = sharedValue;

        this.change.emit(sharedValue);
    }

    public relogin() {
        if (UiCookie.get('RNB')) {
            this.api
                .prep('user', 'relogin')
                .call()
                .subscribe(
                    (data) => {
                        this.set(data);
                    }, (error) => {
                        console.error(error);
                        UiCookie.delete('RNB');
                        switch (error.executionCode) {
                            case 1:
                                UiSnackbar.show({
                                    text: 'Sua sessão expirou',
                                    actionText: 'OK',
                                    duration: Infinity,
                                    action: close => close(),
                                });
                                break;
                        }
                    }
                );
        } else {
            this.set(null);
        }
    }
}
/**/
