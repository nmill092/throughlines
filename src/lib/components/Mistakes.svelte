<script lang="ts">
  interface Props {
    mistakes: number; 
  }  

  let { mistakes }: Props = $props(); 
</script>

<div class="mistakes">
  {#each Array.from({ length: 4 }) as _, i}
    <div class="mistake" class:filled={i < mistakes}>

    </div>
  {/each}
</div>

<style>
  .mistakes {
    justify-content: center;
    display: flex; 
    gap: var(--space-2xs); 
  }

  .mistake {
    width: 1rem; 
    aspect-ratio: 1; 
    border-radius: 100%; 
    border: 1px solid var(--color-body);
    background-color: var(--color-paper);
  }

  .filled {
    animation: .3s ease pop; 
    background-color: var(--color-body);
  }

  @keyframes pop {
    0%, 100% {
      scale: 1; 
    } 50% {
      scale: 1.2; 
    }
  }
</style>