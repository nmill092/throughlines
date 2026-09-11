<script lang="ts">
	import { motion } from '$lib/motion.svelte';
</script>

<label class="motion"
	>Reduce Motion
	<input
		checked={motion.reduced}
		onchange={() => motion.toggle()}
		class="switch"
		type="checkbox"
		role="switch"
	/>
</label>

<style>
	.switch {
		appearance: none;
		width: 3rem;
		height: 1.5rem;
		border-radius: var(--radius-pill);
		position: relative;
		display: grid;
		align-items: center;
		background: oklch(from var(--color-offblack) calc(l + 0.45) c h);
		cursor: pointer;

		&:checked {
			background: oklch(77.4% 0.15 238.36);
		}

    &:focus-visible {
      outline: 2px solid oklch(77.4% 0.15 238.36); 
    }

		&::after {
			content: '';
			border-radius: 100%;
			background-color: white;
			height: 70%;
			aspect-ratio: 1;
			left: 10%;
			position: absolute;
		}

		&:checked::after {
			left: initial;
			right: 10%; 
		}
	}

	.motion {
		display: flex;
		gap: 0.5rem;
	}
</style>
