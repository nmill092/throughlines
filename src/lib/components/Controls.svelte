<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		canDeselect: boolean;
		canSubmit: boolean;
		canInteract: boolean;
		onSubmit: () => void;
		onShuffle: () => void;
		onDeselect: () => void;
	}

	let { canDeselect, canSubmit, onShuffle, onSubmit, onDeselect } = $props();
</script>

<div role="group" in:fade aria-label="Board controls" class="controls">
	<button class="pill control" onclick={onShuffle}>Shuffle</button>
	<button class="pill control" disabled={!canSubmit} onclick={onSubmit}>Guess</button>
	<button class="pill control" disabled={!canDeselect} onclick={onDeselect}>Deselect All</button>
</div>

<style>
	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-s);
	}

	.control {
		--px: var(--space-md);
		text-transform: uppercase;
		transition:
			scale 0.4s
				linear(
					0,
					0.528 7%,
					0.921 14.4%,
					1.07 18.3%,
					1.19 22.4%,
					1.28 26.7%,
					1.34 31.2%,
					1.366 34.5%,
					1.378 38%,
					1.377 41.7%,
					1.363 45.6%,
					1.308 53.3%,
					1.13 71.3%,
					1.059 80.1%,
					1.013 89.7%,
					1
				),
			rotate 0.4s
				linear(
					0,
					0.528 7%,
					0.921 14.4%,
					1.07 18.3%,
					1.19 22.4%,
					1.28 26.7%,
					1.34 31.2%,
					1.366 34.5%,
					1.378 38%,
					1.377 41.7%,
					1.363 45.6%,
					1.308 53.3%,
					1.13 71.3%,
					1.059 80.1%,
					1.013 89.7%,
					1
				);
		&:hover:not(:disabled) {
			scale: 1.03;
			rotate: 1deg;
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}
</style>
