import {AfterViewInit, Directive, ElementRef, Input, ViewContainerRef} from '@angular/core';

import {UiElement, UiWindowRef} from 'ng-smn-ui';

@Directive({
    selector: '[tfyNotificationsTrigger]'
})
export class TfyNotificationsTriggerDirective implements AfterViewInit {
    viewRef;
    @Input('tfyNotificationsTrigger') notifications;

    constructor(public viewContainerRef: ViewContainerRef, public elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        this.notifications.closeChange.subscribe(() => {
            this.close();
        });

        UiElement.on(this.elementRef.nativeElement, 'click', () => {
            if (this.notifications.opened) {
                this.close();
            } else {
                this.notifications.opened = true;
                setTimeout(() => {
                    const position = UiElement.position(this.elementRef.nativeElement, true);
                    const coordinate = {
                        x: position.left,
                        y: position.top
                    };
                    this.render(coordinate);
                });
            }
        });

        UiElement.on(UiWindowRef.nativeWindow, 'click resize', (e) => {
            if (this.elementRef.nativeElement !== e.target) {
                this.close();
            }
        });
    }

    render(coordinate) {
        this.viewRef = this.viewContainerRef.createEmbeddedView(this.notifications.templateRef);
        this.viewRef.detectChanges();

        this.viewRef.rootNodes.forEach(rootNode => {
            document.body.appendChild(rootNode);

            if (rootNode.clientWidth) {
                this.open(rootNode, coordinate);
            }
        });
    }

    open(element, coordinate) {
        setTimeout(() => {
            const verticalCoveringArea = coordinate.y + element.clientHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const originalX = coordinate.x;

            coordinate.x -= element.clientWidth - this.elementRef.nativeElement.clientWidth;
            const horizontalCoveringArea = coordinate.x;

            if (horizontalCoveringArea > windowWidth) {
                coordinate.x = windowWidth - (element.clientWidth + 8);
            }

            const arrow = element.querySelectorAll('.arrow')[0];

            if (coordinate.x <= 8) {
                coordinate.x = 8;
                element.style.right = '8px';
                element.style.width = 'auto';
                element.style.left = coordinate.x + 'px';
                arrow.style.left = originalX - 4 + 'px';
                arrow.style.right = 'auto';
            } else {
                element.style.width = '';
                element.style.right = '';
                coordinate.x += 2;
                arrow.style.left = '';
                arrow.style.right = '';
            }

            if (verticalCoveringArea > windowHeight) {
                coordinate.y = windowHeight - (element.clientHeight + 8);
            } else {
                coordinate.y += this.elementRef.nativeElement.clientHeight;
            }

            element.style.transform = '';
            element.style.top = coordinate.y + 'px';
            element.style.left = coordinate.x + 'px';

            element.classList.add('open');
        });
    }

    close() {
        if (this.viewContainerRef.length) {
            this.notifications.opened = false;

            const viewRef = this.viewRef; // Salvando a referência para achar o index deste componente

            viewRef.rootNodes.forEach(rootNode => {
                if (rootNode.classList) {
                    rootNode.classList.remove('open');
                }
            });

            setTimeout(() => this.viewContainerRef.remove(this.viewContainerRef.indexOf(viewRef)), 280);
        }
    }

}
/**/
