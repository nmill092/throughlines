<script lang="ts">
  import { type ClientPuzzle } from '$lib/types/client';
	import type { GuessResponse, SolvedGroup } from '$lib/types/puzzle';
	import type { AnimationPhase, GameStatus } from '$lib/types/game';

	import Board from './Board.svelte';
	import Controls from './Controls.svelte';
	import Mistakes from './Mistakes.svelte';

	import { toShuffled } from '$lib/utils';
	import Toast from './Toast.svelte';
	import { correctMessages, incorrectMessages, oneAwayMessage, pickMessage, type ToastMessage } from '$lib/toast';
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

	let board: Board;

	let canInteract = $derived(animationPhase === null && gameStatus === 'playing');
	let canSubmit = $derived(canInteract && selectedTileIds.length === puzzle.groupSize);
	let canDeselect = $derived(selectedTileIds.length > 0);

	let tiles = $state(puzzle.tiles.sort((a, b) => (a.position > b.position ? 1 : -1)));

  $effect(() => {
    if (!toastMessage) return; 
    const t = setTimeout(() => (toastMessage = null), 2000)
    return () => clearTimeout(t); 
  })

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
		animationPhase = 'shuffling';
		await board.shuffleTiles(() => (tiles = toShuffled(tiles)));
		animationPhase = null;
	};

	const handleDeselectAll = () => {
		if (!canInteract) return;
		selectedTileIds = [];
	};

  const updateToastMessage = (message: ToastMessage) => 
    toastMessage = message; 

	const handleSubmitGuess = async () => {
		if (!canSubmit || !canInteract) return;
		gameStatus = 'submitting';

		try {
			const res = await fetch(`/api/guess/${puzzle.number}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tileIds: selectedTileIds })
			});

			if (!res.ok) {
				throw new Error(`Guess request failed: ${res.status}`);
			}

			const response: GuessResponse = await res.json();
      await evaluateResult(response);
		} catch (err) {
			console.error({ err });
		} finally {
			gameStatus = 'playing';
		}
	};

  const handleCorrectGuess = async (responseGroup: SolvedGroup) => {
    animationPhase = 'celebrating';
    await board.celebrateTiles(responseGroup.difficulty);

    animationPhase = 'gathering';
    await board.gatherTiles(() => {
        tiles = [
          ...tiles.filter((t) => selectedTileIds.includes(t.id)),
          ...tiles.filter((t) => !selectedTileIds.includes(t.id))
        ];
      });  

    animationPhase = 'fusing';
    tiles = [...tiles.filter((t) => !selectedTileIds.includes(t.id))]; 

    solvedGroups.push(responseGroup);
    selectedTileIds = []; 
    animationPhase = null; 
  }

  const handleIncorrectGuess = async () => {
    animationPhase = 'shaking'; 
    mistakes++; 
    await board.shakeTiles(); 
    selectedTileIds = []; 
    animationPhase = null; 
  }

  const evaluateResult = async (response: GuessResponse) => {
    if (response.result === 'correct') {
      toastMessage = pickMessage(correctMessages); 
      await handleCorrectGuess(response.group);
    } else if (response.result === 'incorrect') {
      toastMessage = pickMessage(incorrectMessages); 
      await handleIncorrectGuess(); 
    } else if (response.result === 'one-away') {
      toastMessage = oneAwayMessage; 
      await handleIncorrectGuess(); 
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
		{selectedTileIds}
		{tiles}
    {solvedGroups}
		groupSize={puzzle.groupSize}
		onReady={handleBoardReady}
		onToggleTile={handleToggleTile}
	/>
	{#if boardReady}
    <Toast message={toastMessage}/>
    <Mistakes {mistakes}/>
		<Controls
			{canDeselect}
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
