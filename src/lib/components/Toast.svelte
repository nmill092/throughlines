<script lang="ts">
	import type { ToastMessage } from "$lib/toast";
	import { fade, fly } from "svelte/transition";

  interface Props {
    message: ToastMessage | null 
  }

  let { message }: Props = $props(); 

</script>

<div
  class="toast" 
  role="status" 
  aria-live="polite">
  {#if message}
    {#key message.id}
     <p class="toast__message" in:fly|global={{ y: 500 }} out:fade|global>{ message.text }</p> 
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