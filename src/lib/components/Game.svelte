<script lang="ts">
	import { type ClientPuzzle } from '$lib/types/client';
	import type { AnimationPhase, GameStatus } from '$lib/types/game';
	import type { GuessResponse, SolvedGroup } from '$lib/types/puzzle';

	import Board from './Board.svelte';
	import Controls from './Controls.svelte';
	import Mistakes from './Mistakes.svelte';

	import {
		pickMessage,
		toastMessages,
		type ToastKey,
		type ToastMessage
	} from '$lib/toast';
	import { toShuffled } from '$lib/utils';
	import Toast from './Toast.svelte';
	interface Props {
		puzzle: ClientPuzzle;
	}

	let { puzzle }: Props = $props();

	let animationPhase: AnimationPhase = $state('intro');
	let gameStatus: GameStatus = $state('playing');
	let selectedTileIds = $state<number[]>([]);
	let boardReady = $state(false);
	let solvedGroups = $state<SolvedGroup[]>([]);
	let mistakes = $state(0);
	let toastMessage = $state<ToastMessage | null>(null);
	let guessKeys = $state<string[]>([]);

	let board: Board;

	let canInteract = $derived(animationPhase === null && gameStatus === 'playing');
	let canSubmit = $derived(canInteract && selectedTileIds.length === puzzle.groupSize);
  let canSelect = $derived(canInteract && selectedTileIds.length < puzzle.groupSize); 
	let canDeselect = $derived(selectedTileIds.length > 0);

	let tiles = $state(puzzle.tiles.sort((a, b) => (a.position > b.position ? 1 : -1)));

	$effect(() => {
		if (!toastMessage) return;
		const t = setTimeout(() => (toastMessage = null), 2000);
		return () => clearTimeout(t);
	});

	const handleToggleTile = (id: number) => {
		if (!canInteract) return;
		if (selectedTileIds.includes(id)) {
			selectedTileIds = selectedTileIds.filter((tId) => tId !== id);
		} else {
			selectedTileIds.push(id);
		}
	};

	const handleBoardReady = () => {
		animationPhase = null;
		boardReady = true;
	};

	const handleShuffleTiles = async () => {
		if (!canInteract) return;
		animationPhase = 'shuffling';
		await board.shuffleTiles(() => (tiles = toShuffled(tiles)));
		animationPhase = null;
	};

	const handleDeselectAll = () => {
		if (!canInteract) return;
		selectedTileIds = [];
	};

	const handleSubmitGuess = async () => {
		if (!canSubmit || !canInteract) return;

		const guessKey = [...selectedTileIds].sort().join(',');

		if (guessKeys.includes(guessKey)) {
			showToast('duplicate');
			return;
		}

		guessKeys.push(guessKey);

		gameStatus = 'submitting';

		try {
			const res = await fetch(`/api/guess/${puzzle.number}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tileIds: selectedTileIds, mistakes })
			});

			if (!res.ok) {
				throw new Error(`Guess request failed: ${res.status}`);
			}

			const response: GuessResponse = await res.json();
			await evaluateResult(response);
		} catch (err) {
			console.error({ err });
		} finally {
			if (gameStatus === 'submitting') {
				gameStatus = 'playing';
			} else if (gameStatus === 'revealing-loss') {
				gameStatus = 'lost';
			}
		}
	};

	const absorbTiles = async (group: SolvedGroup, groupIds: number[]) => {
		animationPhase = 'gathering';

		await board.gatherTiles(() => {
			tiles = [
				...tiles.filter((t) => groupIds.includes(t.id)),
				...tiles.filter((t) => !groupIds.includes(t.id))
			];
		});

		animationPhase = 'fusing';
		tiles = [...tiles.filter((t) => !groupIds.includes(t.id))];

		solvedGroups.push(group);
	};

	const handleCorrectGuess = async (responseGroup: SolvedGroup) => {
		const groupTileIds = responseGroup.tiles.map((t) => t.id);
		animationPhase = 'celebrating';
		await board.celebrateTiles(groupTileIds, responseGroup.difficulty);
		await absorbTiles(responseGroup, groupTileIds);
		selectedTileIds = [];
		animationPhase = null;
	};

	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

	const handleIncorrectGuess = async (solution?: SolvedGroup[]) => {
		animationPhase = 'shaking';
		mistakes++;

		await board.shakeTiles();
		await delay(500);

		selectedTileIds = [];

		if (mistakes === 4) {
			gameStatus = 'revealing-loss';

			if (solution) {
				const solvedGrpIds = solvedGroups.map((grp) => grp.difficulty);
				const unsolvedGroups = solution
          .filter((grp) => !solvedGrpIds.includes(grp.difficulty))
          .sort((a, b) => a.difficulty - b.difficulty); 

				for (const grp of unsolvedGroups) {
					await absorbTiles(grp, grp.tiles.map((t) => t.id));
					await delay(500);
				}
			}

			gameStatus = 'lost';
		}

		animationPhase = null;
	};

	const evaluateResult = async (response: GuessResponse) => {
		if (response.result === 'correct') {
      showToast('correct');
			await handleCorrectGuess(response.group);
		} else if (response.result === 'incorrect') {
      showToast('incorrect');
			await handleIncorrectGuess(response.solution);
		} else if (response.result === 'one-away') {
      showToast('one-away');
			await handleIncorrectGuess(response.solution);
		}
	};


  const showToast = (result: ToastKey) => {
    if (mistakes === 3 && (result === 'incorrect' || result === 'one-away')) {
      toastMessage = pickMessage(toastMessages.lost);
    } else {
      toastMessage = pickMessage(toastMessages[result]); 
    }
  }

</script>

<div class="game__inner">
	<div class="game__lede">
		<h1 class="game__number">Throughlines #{puzzle.number}</h1>
		<p class="game__instructions">Create four groups of four related words. Good luck!</p>
	</div>
	<Board
		bind:this={board}
		{canInteract}
    {canSelect}
		{selectedTileIds}
		{tiles}
		{solvedGroups}
		groupSize={puzzle.groupSize}
		onReady={handleBoardReady}
		onToggleTile={handleToggleTile}
	/>
	{#if boardReady}
		<Toast message={toastMessage} />
		<Mistakes {mistakes} />
		<Controls
			{canDeselect}
			{canInteract}
			{canSubmit}
			onShuffle={handleShuffleTiles}
			onDeselect={handleDeselectAll}
			onSubmit={handleSubmitGuess}
		/>
	{/if}
</div>

<style>
	.game__inner {
		padding-block-start: var(--space-md);
		display: grid;
		gap: var(--space-s);
		position: relative;
	}

	.game__lede {
		display: flex;
		text-align: center;
		justify-content: center;
		flex-direction: column;
	}

	.game__number {
		font-size: var(--fs-lg);
		text-transform: uppercase;
		font-weight: 800;
		letter-spacing: -5%;
		line-height: 1.1;
	}
</style>
