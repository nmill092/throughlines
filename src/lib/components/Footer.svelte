<script lang="ts">
  import { motion } from "$lib/motion.svelte";
</script>

<footer class="footer">
  <div class="container--wide">
    <div class="footer__inner">
      <div class="motion">
        Disable Animations? { motion.reduced ? 'Disable' : 'Enable' }
        <button onclick={() => motion.toggle()}>Toggle</button>
      </div>
    </div>
  </div>
</footer>


<style>
  .footer {
    height: 4rem; 
    background-color: var(--color-accent);
    display: flex;
    align-items: center;
  }

  .footer__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>