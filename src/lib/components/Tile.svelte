<script lang="ts">
	import { fade, scale } from "svelte/transition";

  interface Props { 
    id: number, 
    canInteract: boolean, 
    position: number,
    text: string,
    selected: boolean,
    onIntroEnd: () => void; 
    onToggleSelect: () => void; 
    registerTileEl: (node: HTMLElement, id: number) => void; 
  }

  let { 
    id, 
    canInteract, 
    position,
    text, 
    selected, 
    onIntroEnd,
    onToggleSelect, 
    registerTileEl 
  }: Props = $props(); 

  let mounted = $state(false); 

  $effect(() => {
    mounted = true; 
  });
</script>


{#if mounted}
  <button
      in:scale={{ delay: position * 20 }}
      class="tile" 
      disabled={!canInteract}
      class:selected={selected} 
      use:registerTileEl={id}
      onclick={onToggleSelect}
      onintroend={onIntroEnd}>
      { text }
  </button>
{/if}

<style>
  .tile {
    display: grid;
		place-content: center;
		background-color: var(--color-tile);
		border-radius: 0.4rem;
		border: none;
    text-transform: uppercase; 
    transition: .2s ease background-color; 

    &:hover {
			background-color: oklch(90.28% 0.01 171.77);
		}

		&.selected {
			color: oklch(94.02% 0.01 177.32);
			background-color: oklch(30.7% 0.01 184.71);
		}

    &:disabled {
      cursor: not-allowed;
    }
  }
</style>