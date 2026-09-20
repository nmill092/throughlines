<script lang="ts">
	import { onMount } from 'svelte';
  import { onNavigate } from '$app/navigation';

	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { motion } from '$lib/motion.svelte';

	import '$styles/globals.css';
	import '@fontsource-variable/public-sans/wght.css';

	let { children } = $props();

  onMount(() => {
    motion.init(); 
  })

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head></svelte:head>

<Header/>

<main>
    {@render children()}
</main>

<Footer/>

<style>
  main {
    display: grid;
  }
</style>
