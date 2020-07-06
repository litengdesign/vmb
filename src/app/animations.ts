import {
    animation, trigger, animateChild, group,
    transition, animate, style, query, state
} from '@angular/animations';

export const transAnimation = animation([
    style({
        height: '{{ height }}',
        opacity: '{{ opacity }}',
        backgroundColor: '{{ backgroundColor }}'
    }),
    animate('{{ time }}')
]);

// Routable animations
export const slideInAnimation =
    trigger('routeAnimations', [
        transition('* <=> *', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '-100%' })
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('200ms ease-out', style({ left: '100%' }))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ])
    ]);


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

//thumb animations

export const fadeInAnimation = trigger('cardTransition', [
    state('open', style({
        opacity: 1,
    })),
    state('fadeInLeft', style({
        display:'none',
        opacity: 0,
        transform: 'translateX(-100%)',
    })),
    state('fadeInRight', style({
        display:'none',
        opacity: 0,
        transform: 'translateX(100%)',
    })),
    state('zoomout', style({
        position: 'fixed',
        left:0,
        bottom:0,
    })),
    state('zoomin', style({
        position: 'relative',
    })),
    state('fadeInBottom', style({
        opacity: 0,
        transform: 'translateY(180%)',
    })),
    state('closed', style({
        opacity: 0,
    })),
    transition('zoomin<=>zoomout',[
        animate('1.5s')
    ]),
    transition('* <=> *', [
        animate('1s')
    ]),
])

export const navigateAnimation = trigger('navigateTransition',[
    state('open', style({
        opacity: 1,
    })),
    state('close', style({
        opacity: 0,
    })),
    transition('* => *', [
        animate('1s')
    ]),
])


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
