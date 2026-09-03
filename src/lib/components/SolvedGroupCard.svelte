<script lang="ts">
	import type { SolvedGroup } from '$lib/types/puzzle';
	import { elasticOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	interface Props {
		group: SolvedGroup;
	}

	let { group }: Props = $props();
</script>

<div
	class="group"
	style:background-color={`var(--color-difficulty-${group.difficulty})`}
	in:scale={{ start: 0.7, duration: 800, easing: elasticOut }}
>
<div class="group__text">
  <div class="group__title">
    {group.title}
  </div>
  <div class="group__tiles">
    { group.tiles.map(t => t.text).join(', ')}
  </div>
</div>
</div>

<style>
	.group {
		grid-column: 1 / -1;
		border-radius: 10px;
		display: grid;
		text-transform: uppercase;
		place-content: center;
	}

  .group__text {
    display: grid; 
    text-align: center;
  }

  .group__title {
    font-weight: 800; 
  }
</style>
