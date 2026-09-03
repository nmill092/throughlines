<script lang="ts">
	import Game from '$lib/components/Game.svelte';
	let { data } = $props();
</script>

<section class="game">
	<div class="container">
		<Game puzzle={data.puzzle} />
	</div>
</section>

<style>
</style>
