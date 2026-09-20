<script lang="ts">
	import Game from '$lib/components/Game.svelte';
	let { data } = $props();
</script>

<section class="game">
		<Game puzzle={data.puzzle} />	
</section>

<style>
</style>
