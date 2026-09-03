<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '$styles/globals.css';
	import '@fontsource-variable/public-sans/wght.css';
	let { children } = $props();
</script>

<svelte:head></svelte:head>

<Header/>

<main>
  {@render children()}
</main>

<Footer/>

<style>
	
</style>
