<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { motion } from '$lib/motion.svelte';
	import '$styles/globals.css';
	import '@fontsource-variable/public-sans/wght.css';
	import { onMount } from 'svelte';
	let { children } = $props();

  onMount(() => {
    motion.init(); 
  })
</script>

<svelte:head></svelte:head>

<Header/>

<main>
  {@render children()}
</main>

<Footer/>

<style>
	
</style>
