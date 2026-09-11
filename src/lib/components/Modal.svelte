<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		modalOpen: boolean;
		outcome: 'won' | 'lost' | null;
		guessDifficulties: (1 | 2 | 3 | 4)[][] | null;
		mistakes: number;
		onClose: () => void;
		onReset: () => void;
	}

	let {
		modalOpen,
		guessDifficulties,
		outcome,
		mistakes,
		onClose,
		onReset
	}: Props = $props();
	let dialog = $state<HTMLDialogElement | null>(null);

  let correctGuesses = $derived(guessDifficulties?.filter(guesses => new Set(guesses).size === 1).length ?? 0); 

	$effect(() => {
    if(!dialog) return; 
		if (modalOpen) {
			if (!dialog.open) dialog.showModal();
		} else {
			dialog.close();
		}
	});
</script>

 {#key modalOpen}

<dialog
in:fade={{ duration: 300 }}
out:fade={{ duration: 300 }}
	aria-labelledby="game-result"
	class="modal"
	bind:this={dialog}
	closedby="any"
	onclose={onClose}
>
	<div class="modal__inner" >
		<div class="modal__header">
			<h2 id="game-result">
				{#if outcome === 'lost'}
					Better luck next time!
				{:else if outcome === 'won'}
					Good job!
				{/if}
			</h2>
			<p class="modal__text">
				{#if outcome === 'lost'}
					You got {correctGuesses} out of 4 throughlines!
				{:else if outcome === 'won'}
					You solved the puzzle with {mistakes} {mistakes > 1 ? 'mistakes' : 'mistake'}!
				{/if}

        Here are your results: 
			</p>
		</div>
		<div class="modal__results">
			{#each guessDifficulties as guessDifficulty}
				<div class="results__row">
					{#each guessDifficulty as difficultyNum}
						<div
							class="modal__guess-icon"
							style:background-color={`var(--color-difficulty-${difficultyNum})`}
						></div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="modal__controls">
			<button class="pill" onclick={onClose}>Close</button>
			<button class="pill" onclick={onReset}>Reset Game</button>
			<a class="pill" href="/archive">Puzzle Archive</a>
		</div>
	</div>
</dialog>
  {/key}

<style>

	.modal {
		padding: 0;
		border: none;
		width: min(100% - 2rem, 35rem);
		max-height: 45rem;
		overflow-y: auto;
		background-color: var(--color-paper);
		border-radius: 0.4rem;
		box-shadow: 1px 1px 10px oklch(from var(--color-body) l c h / 0.4);

		&::backdrop {
			background-color: oklch(from var(--color-body) l c h / 0.4);
		}
	}

	.modal__inner {
		padding-block: var(--space-s);
		padding-inline: var(--space-md);
		display: grid;
		gap: var(--space-md);
		justify-items: center;

		h2 {
			font-size: var(--fs-2xl);
			font-family: var(--font-brand), var(--font-body), sans-serif;
			text-align: center;
		}

		.modal__text {
			text-align: center;
			font-size: var(--fs-s);
		}
	}

	.modal__results {
		display: grid;
		gap: 0.1rem;
	}

	.results__row {
		display: flex;
		gap: 0.1rem;
	}

	.modal__guess-icon {
		width: 25px;
		border-radius: 3px;
		aspect-ratio: 1;
	}

	.modal__controls {
		display: flex;
		gap: var(--space-3xs);
	}
</style>
