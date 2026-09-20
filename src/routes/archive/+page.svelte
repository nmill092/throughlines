<script lang="ts">
	import { motion } from '$lib/motion.svelte';
	import { loadAllGames } from '$lib/storage';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	type FilterStatus = 'playing' | 'won' | 'lost' | null;

	let { data } = $props();
	let puzzles = data.puzzles;
	let store = loadAllGames();
	let filter: FilterStatus = $state(null);

	let puzzlesWithGameData = puzzles.map((puzzleNumber) => {
		const { status, mistakes, correctGuesses } = store[puzzleNumber] ?? {
			status: null,
			mistakes: null,
			correctGuesses: 0
		};

		return {
			number: puzzleNumber,
			status,
			mistakes,
			correctGuesses
		};
	});

	const onFilter = (nextStatus: FilterStatus) => {
		nextStatus === filter ? (filter = null) : (filter = nextStatus);
	};
</script>

<section class="archive">
	<div class="container">
		<div class="archive__inner">
			<header class="archive__header">
				<h1>Puzzle Archive</h1>
				<p>Discover new puzzles and resume unfinished ones!</p>
			</header>
			<div class="archive__filters">
				<button
					class:active={filter === null}
					class="archive__filter-btn archive__filter-btn--all pill"
					onclick={() => onFilter(null)}>All</button
				>
				<button
					class:active={filter === 'playing'}
					class="archive__filter-btn archive__filter-btn--playing pill"
					onclick={() => onFilter('playing')}
					>In Progress <div class="chip"></div></button
				>
				<button
					class:active={filter === 'won'}
					class="archive__filter-btn archive__filter-btn--won pill"
					onclick={() => onFilter('won')}
					>Won <div class="chip"></div></button
				>
				<button
					class:active={filter === 'lost'}
					class="archive__filter-btn archive__filter-btn--lost pill"
					onclick={() => onFilter('lost')}
					>Lost <div class="chip"></div></button
				>
			</div>
			<ul class="archive__grid">
				{#each puzzlesWithGameData.filter((puzzle) => !filter || puzzle.status === filter) as puzzle (puzzle.number)}
					<li 
            animate:flip={{ duration: motion.reduced ? 0 : 250 }} class="archive__tile">
						<a
							href="/play/{puzzle.number}"
							class:tile--in-progress={puzzle.status === 'playing'}
							class:tile--won={puzzle.status === 'won'}
							class:tile--lost={puzzle.status === 'lost'}
						>
							<div class="tile__info">
								<span class="tile__number">{puzzle.number}</span>

								{#if puzzle.status}
									<div class="tile__row">
										<span class="row__key">{puzzle.mistakes} / 4</span> mistakes
									</div>

									<div class="tile__row">
										<span class="row__key">{puzzle.correctGuesses} / 4</span> solved
									</div>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	:root {
		--won: var(--color-green);
		--playing: var(--color-blue);
		--lost: var(--color-yellow);
	}

	.archive {
		padding-block-start: var(--space-xl);
	}

  .archive__filters {
    display: flex; 
    gap: .5rem; 
  }

	.archive__filter-btn {
    display: flex; 
    gap: .5rem; 

		&.active {
			color: var(--color-jameswhite);
			background-color: var(--color-offblack);
		}
	}

	.archive__header {
		text-align: center;

		h1 {
			font-size: var(--fs-lg);
			font-weight: 900;
			text-transform: uppercase;
			letter-spacing: -5%;
		}
	}

	.archive__inner {
		display: grid;
		gap: 2rem;
	}

	.archive__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-auto-rows: 150px;
		list-style: none;
		gap: var(--space-xs);
	}

	.archive__tile {
		background-color: var(--color-jameswhite);
		color: var(--color-offblack);
		display: grid;
		border-radius: 0.4rem;

		overflow: hidden;
		text-align: center;
		a {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.tile--in-progress {
		background-color: var(--playing);
	}

	.tile--won {
		background-color: var(--won);
	}

	.tile--lost {
		background-color: var(--lost);
	}

	.tile__number {
		font-weight: 800;
		font-size: var(--fs-2xl);
	}

	.tile__info {
		/* margin-block-start: var(--space-md); */
	}

	.tile__stats {
		font-size: var(--fs-xs);
	}

	.tile__row {
		display: flex;
		gap: var(--space-3xs);
		font-size: var(--fs-xs);
		text-align: center;
		justify-content: center;
	}

	.row__key {
		font-weight: 800;
	}

  .chip {
    width: 10px; 
    height: 10px; 
    border-radius: 100%; 

    .archive__filter-btn--lost & { 
      background-color: var(--lost);
    }

    .archive__filter-btn--won & { 
      background-color: var(--won);
    }

    .archive__filter-btn--playing & { 
      background-color: var(--playing);
    }
  }
</style>
