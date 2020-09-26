import { trigger, state, animate, transition, style } from '@angular/animations';

export const opacity = trigger('opacity', [
	state('show', style({
		opacity: '{{ value }}',
	}), { params: { value: 1.0 }}),
	state('hide', style({
		opacity: 0.0
	})),
	transition('hide=>show', animate('200ms {{delay}} ease-in'),
		{ params: { delay: '0.0s' }}),
	transition('show=>hide', animate('200ms ease-out')),
]);