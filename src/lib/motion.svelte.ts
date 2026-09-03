import { prefersReducedMotion } from 'svelte/motion';

let userReducedMotion = $state(false);

export const motion = {
	get userReduced() {
		return userReducedMotion;
	},

	get reduced() {
		return prefersReducedMotion.current || userReducedMotion;
	},

	toggle() {
		userReducedMotion = !userReducedMotion;
	}
};