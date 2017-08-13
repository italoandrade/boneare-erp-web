import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';

import {UiToolbarService, UiCookie, UiColor} from 'ng-smn-ui';

import {UserService} from './core/services/user.service';
import {ApiService} from './core/api/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    title: string;
    menuOpen: boolean;
    user: {
        unreadNotifications?: number,
        picture?: string,
        color?: string,
        fullname?: string,
        notifications?: any[],
        url?: string
    };
    isBright = UiColor.isBright;

    constructor(private titleService: Title,
                private toolbarService: UiToolbarService,
                private userService: UserService,
                private api: ApiService,
                private router: Router,
                private route: ActivatedRoute) {
        toolbarService.change.subscribe(title => this.title = title);
        userService.change.subscribe(user => this.user = user);
    }

    ngOnInit() {
        this.titleService.setTitle('Boneare ERP');
        this.toolbarService.set('Boneare ERP');

        this.userService.relogin();

        if (UiCookie.get('NavDrawerPersistent') === 'true') {
            this.menuOpen = true;
        }

        this.toolbarService.registerMainToolbar(document.getElementById('app-header'));
    }

    signOut() {
        UiCookie.delete('RNB');
        this.userService.relogin();
        console.log(this.router);
        console.log(this.route);


        const currentRouteConfig = this.router.config.find(f => f.path === this.router.url.substr(1));
        if (currentRouteConfig != null && currentRouteConfig.canActivate != null) {
            this.router.navigate(['/']);
        }
    }
}

/**/
