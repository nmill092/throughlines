<script lang="ts">
	import type { ClientTile } from "$lib/types/client";
	import { SvelteMap } from "svelte/reactivity";
	import Tile from "./Tile.svelte";
  import gsap from 'gsap';
  import { Flip } from 'gsap/Flip'; 
	import { tick } from "svelte";
	import type { SolvedGroup } from "$lib/types/puzzle";
	import SolvedGroupCard from "./SolvedGroupCard.svelte";

  gsap.registerPlugin(Flip);

  let tileMap = $state(new SvelteMap());

  interface Props {
    canInteract: boolean; 
    selectedTileIds: number[];
    tiles: ClientTile[];
    groupSize: 3 | 4;
    solvedGroups: SolvedGroup[]; 
    onReady: () => void; 
    onToggleTile: (id: number) => void;
  }

  let { 
    canInteract,
    selectedTileIds, 
    tiles, 
    groupSize, 
    solvedGroups,
    onReady, 
    onToggleTile,
  }: Props = $props();

   const getTilesById = (ids: number[]) => 
    ids.map(id => tileMap.get(id))
       .filter((el): el is HTMLElement => Boolean(el)); 
      
  const getTileState = () => {
    const tileIds = [...tileMap.keys()]
      .filter((id): id is number => Number.isInteger(id)); 
    const tiles = getTilesById(tileIds); 
    return Flip.getState(tiles);
  }

   const registerTileEl = (node: HTMLElement, id: number) => {
    tileMap.set(id, node); 

    return {
      destroy() { 
        tileMap.delete(id); 
      }
    }
  }

  let tilesIntrod = 0; 

  const handleTileIntroEnd = () => {
    tilesIntrod+=1;
    if (tilesIntrod === tiles.length) {
      onReady?.(); 
    } 
  }

  const tileHeight = 120;

  export const shuffleTiles = async (flipAction: () => void) => {
    const state = getTileState(); 
    flipAction(); 
    await tick(); 
    return new Promise(res => {
      Flip.from(state, { 
        duration: .5,
        ease: 'back.out',
        onComplete: res
      });
    }); 
  }

  export const gatherTiles = async (flipAction: () => void) => {
    const state = getTileState(); 
    flipAction(); 
    await tick(); 
    return new Promise<void>(res => {
      Flip.from(state, {
        duration: 0.5, 
        ease: 'back.out',
        onComplete: res 
      })
    })
  }

  export const celebrateTiles = async (difficulty: number) => {
    const tiles = getTilesById(selectedTileIds); 
    return new Promise((res) => {
			gsap.killTweensOf(tiles);
			const tl = gsap.timeline({ 
        defaults: {
        
        }, 
        onComplete: res });

			tl.to(tiles, {
				y: -25,
				stagger: 0.05,
				duration: 0.4,
				scale: 1.08, 
			}, 0).to(
				tiles,
				{
					y: 0,
					scale: 1,
					stagger: 0.05,
					duration: 0.4,
				},
				'<.2'
			).to(tiles, { 
        backgroundColor: `var(--color-difficulty-${difficulty})`,
        color: 'var(--color-body)',
        duration: .3,
        stagger: 0.05
      }, 0)
		});
  }

  export const shakeTiles = async() => {
    const tiles = getTilesById(selectedTileIds); 
    gsap.killTweensOf(tiles); 

    return new Promise(res => {
      const tl = gsap.timeline({ defaults: {
        duration: 0.1,
        stagger: .015, 
       
        ease: 'elasticOut'
      }, onComplete: res }); 

      tl
        .to(tiles, { x: -10, })
        .to(tiles, { x: 10 })
        .to(tiles, { x: -5 })
        .to(tiles, { x: 5 })
        .to(tiles, { x: -2 })
        .to(tiles, { x: 2 })
        .to(tiles, { x: 0 })

    })
  }

</script>

<div class="board" 
  style:--tile-height="{tileHeight}px"
  style:--group-size={groupSize}>
  {#each solvedGroups as group}
    <SolvedGroupCard group={group}/>
  {/each}
  {#each tiles as tile (tile.id)}
    <Tile
      {canInteract}
      id={tile.id} 
      position={tile.position}
      selected={selectedTileIds.includes(tile.id)}
      text={tile.text} 
      registerTileEl={registerTileEl}
      onIntroEnd={handleTileIntroEnd}
      onToggleSelect={() => onToggleTile(tile.id)}/>
  {/each}
</div>

<style>
  .board {
    width: min(100%, 42rem);
    margin: auto; 
    display: grid;
		gap: var(--space-3xs);
		grid-template-columns: repeat(var(--group-size, 4), 1fr);
    grid-auto-rows: clamp(3.5rem, 13svh, 7.5rem);
  }
</style>