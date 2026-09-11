<script lang="ts">
	import { motion } from "$lib/motion.svelte";
	import type { ToastMessage } from "$lib/toast";
	import { fade, fly, type FadeParams, type FlyParams } from "svelte/transition";

  interface Props {
    message: ToastMessage | null 
  }

  let { message }: Props = $props(); 

  let inTransition = $derived(!motion.reduced ? fly : fade); 
  let transitionProps: FlyParams | FadeParams = $derived({
    duration: 300, 
    ...(!motion.reduced ? { y: 500 } : {})
  }); 

</script>

<div
  class="toast" 
  role="status" 
  aria-live="polite">
  {#if message}
    {#key message.id}
     <p class="toast__message" 
     in:inTransition|global={transitionProps} 
     out:fade|global>{ message.text }</p> 
    {/key}
  {/if}
</div>

<style>

  .toast {
    inset-inline: 0; 
    position: absolute; 
    display: grid;
    justify-items: center;
    align-items: end; 
    pointer-events: none; 
    z-index:999; 
    inset-block-end: -5rem;
  }

  .toast__message {
    grid-area: 1 / 1; 
    background-color: var(--color-body);
    color: var(--color-paper);
    padding-inline: var(--space-s);
    padding-block: var(--space-2xs);
    border-radius: 5px;
  }
</style>