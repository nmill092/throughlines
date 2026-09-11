import { prefersReducedMotion } from 'svelte/motion';
import { loadMotionPref, saveMotionPref } from './storage';

let override = $state<boolean | null>(null);

export const motion = {
  init () {
    override = loadMotionPref(); 
  },
	get reduced() {
		return override ?? prefersReducedMotion.current;
	},
	toggle() {
    override = !(override ?? prefersReducedMotion.current); 
    saveMotionPref(override);
	}
};