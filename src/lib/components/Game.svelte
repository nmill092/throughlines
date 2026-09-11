<script lang="ts">
	import { Confetti } from 'svelte-confetti';

	import { type ClientPuzzle } from '$lib/types/client';
	import type { AnimationPhase, GameStatus } from '$lib/types/game';
	import type { GuessResponse, SolvedGroup } from '$lib/types/puzzle';

	import Board from './Board.svelte';
	import Controls from './Controls.svelte';
	import Mistakes from './Mistakes.svelte';

	import { delay, toShuffled } from '$lib/utils/helpers';
	import Toast from './Toast.svelte';
	import { motion } from '$lib/motion.svelte';
	import Modal from './Modal.svelte';
	import { onMount } from 'svelte';
	import { clearGame, getMappedSaveStatus, loadGame, saveGame, type SavedGame } from '$lib/storage';
	import { Toaster } from '$lib/toaster.svelte';
	import type { ToastKey } from '$lib/toast';
	
  interface Props {
		puzzle: ClientPuzzle;
	}

	let { puzzle }: Props = $props();

  const toaster = new Toaster(); 

  onMount(() => {
    const saved = loadGame(puzzle.number);
    if (!saved) {
      restored = true; 
      return; 
    }

    mistakes = saved.mistakes; 
    solvedGroups = saved.solvedGroups; 
    guessHistory = saved.guessHistory; 
    gameStatus = saved.status; 
    lostSolution = saved.lostSolution; 
    
    const solved = new Set(solvedGroups.flatMap(grp => grp.tiles).map(tile => tile.id)); 

    const tileOrderMap = new Map<number, number>(); 
    
    saved.tileOrder.forEach((id, idx) => tileOrderMap.set(id, idx)); 

    tiles = [...puzzle.tiles]
      .filter(tile => !solved.has(tile.id))
      .sort((a, b) => (tileOrderMap.get(a.id) ?? Infinity) - (tileOrderMap.get(b.id) ?? Infinity)); 
    restored = true; 
  })

  let restored = $state(false); 
	let animationPhase = $state<AnimationPhase>('intro');
	let gameStatus = $state<GameStatus>('playing');
	let selectedTileIds = $state<number[]>([]);
	let boardReady = $state(false);
	let solvedGroups = $state<SolvedGroup[]>([]);
	let mistakes = $state(0);
  let modalDismissed = $state(false); 
  let guessHistory = $state<number[][]>([]);
  let lostSolution = $state<SolvedGroup[] | null>(null);  // to store the solution when the user loses
	
  let difficultyByTileId = $derived.by(() => {
    if (gameStatus !== 'won' && gameStatus !== 'lost') return null; 

    const resolvedSolution = lostSolution ?? solvedGroups; 
    const tileDifficultyMap = new Map<number, 1 | 2 | 3 | 4>(); 

    resolvedSolution.forEach(category => {
      category.tiles.forEach(tile => 
        tileDifficultyMap.set(tile.id, category.difficulty)); 
    }); 

    return tileDifficultyMap
  }); 


  let guessDifficulties = $derived.by(() => {
    if (!difficultyByTileId) return null; 
    return guessHistory.map(guess => {
      return guess
        .map(tile => difficultyByTileId.get(tile))
        .filter((difficulty): difficulty is (1 | 2 | 3 | 4) => Boolean(difficulty))
        .sort((a, b) => a - b);
    })
  });

	let board = $state<Board | null>(null);

	let canInteract = $derived(animationPhase === null && gameStatus === 'playing');
	let canSubmit = $derived(canInteract && selectedTileIds.length === puzzle.groupSize);
	let canSelect = $derived(canInteract && selectedTileIds.length < puzzle.groupSize);
	let canDeselect = $derived(selectedTileIds.length > 0);
  let modalOpen = $derived(!modalDismissed && ['won', 'lost'].includes(gameStatus)); 
  let outcome: 'won' | 'lost' | null = $derived(gameStatus === 'won' ? 'won' : gameStatus === 'lost' ? 'lost' : null); 
  let guessKeys = $derived(new Set(guessHistory.map(guess => [...guess].sort((a, b) => a - b).join(',')))); 
  
	let tiles = $state([...puzzle.tiles].sort((a, b) => (a.position > b.position ? 1 : -1)));

  const CONFETTI_DURATION_MS = 2000; 
  const MAX_CONFETTI_DELAY = 2000; 

  $effect(() => {
    if (!restored) return; 

    const savedState: SavedGame = {
      status: getMappedSaveStatus(gameStatus),
      solvedGroups: $state.snapshot(solvedGroups), 
      mistakes, 
      guessHistory: $state.snapshot(guessHistory),
      lostSolution: $state.snapshot(lostSolution),
      tileOrder: tiles.map(t => t.id)
    }

    saveGame(puzzle.number, savedState); 

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
    if(boardReady) return; 
		animationPhase = null;
		boardReady = true;
	};

	const handleShuffleTiles = async () => {
		if (!canInteract || !board) return;
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
		const guessKey = [...selectedTileIds].sort((a, b) => a - b).join(',');
    const guessedTileIds = [...selectedTileIds];

		if (guessKeys.has(guessKey)) {
			showToast('duplicate');
			return;
		}

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
      guessHistory.push(guessedTileIds); 
			await evaluateResult(response);
      
		} catch (err) {
			console.error({ err });
		} finally {
			if (gameStatus === 'submitting') {
				gameStatus = 'playing';
			} else if (gameStatus === 'revealing-loss') {
				gameStatus = 'lost';
			} else if (gameStatus === 'celebrating-win') {
				gameStatus = 'won';
			}
		}
	};

	const absorbTiles = async (group: SolvedGroup, groupIds: number[]) => {
    if (!board) return; 
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
    if (!board) return; 
		animationPhase = 'celebrating';

		const groupTileIds = responseGroup.tiles.map((t) => t.id);

    await board.celebrateTiles(groupTileIds, responseGroup.difficulty);
		await absorbTiles(responseGroup, groupTileIds);
		selectedTileIds = [];
		animationPhase = null;

		if (solvedGroups.length === 4) {
      if (!motion.reduced) {
			  gameStatus = 'celebrating-win';
        // because confetti doesn't have any sort of onComplete callback 
        await delay(CONFETTI_DURATION_MS + MAX_CONFETTI_DELAY);
      }
      gameStatus = 'won';
		}
	};

	const handleIncorrectGuess = async (solution?: SolvedGroup[]) => {
    if (!board) return; 
		mistakes++;
    animationPhase = 'shaking';
 
    // if (!motion.reduced) {
		  await board.shakeTiles();
    // }

		await delay(500);

		selectedTileIds = [];

		if (mistakes === 4) {
			gameStatus = 'revealing-loss';

			if (solution) {
        lostSolution = solution; 
				const solvedGrpIds = solvedGroups.map((grp) => grp.difficulty);
				const unsolvedGroups = solution
					.filter((grp) => !solvedGrpIds.includes(grp.difficulty))
					.sort((a, b) => a.difficulty - b.difficulty);

				for (const grp of unsolvedGroups) {
					await absorbTiles(
						grp,
						grp.tiles.map((t) => t.id)
					);
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
      toaster.show('lost'); 
		} else {
      toaster.show(result); 
		}
	};

  const handleResetGame = () => {
    modalDismissed = false; 
    gameStatus = 'playing'; 
    solvedGroups = [];
    tiles = [...puzzle.tiles].sort((a, b) => (a.position > b.position ? 1 : -1)); 
    mistakes = 0; 
    guessHistory = []; 
    lostSolution = null; 
    clearGame(puzzle.number); 
  }
</script>

<div class="game__inner">
	<div class="game__lede">
		<h1 class="game__number">Throughlines #{puzzle.number}</h1>
		<p class="game__instructions">Create four groups of four related words. Good luck!</p>
	</div>
  {#if restored}
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
      <Toast message={toaster.message} />
      <Mistakes {mistakes} />
      <Controls
        {canDeselect}
        {canInteract}
        {canSubmit}
        onShuffle={handleShuffleTiles}
        onDeselect={handleDeselectAll}
        onSubmit={handleSubmitGuess}
      />
      {#if gameStatus === 'celebrating-win'}
        <div class='confetti'>
          <Confetti
            x={[-5, 5]}
            y={[0, 0.1]}
            delay={[500, MAX_CONFETTI_DELAY]}
            duration={CONFETTI_DURATION_MS}
            amount={300}
            fallDistance="100vh"
          />
        </div>
      {/if}
    {/if}
  {/if}
  <Modal 
    {outcome}
    {mistakes}
    {guessDifficulties}
    {modalOpen}
    onClose={() => modalDismissed = true}
    onReset={handleResetGame}
     /> 
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

  .confetti {
    position: fixed;
    top: -50px;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
  }
</style>
