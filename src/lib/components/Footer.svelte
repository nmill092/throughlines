<script lang="ts">
  import { motion } from "$lib/motion.svelte";
	import Switch from "./Switch.svelte";
</script>

<footer class="footer">
  <div class="container">
    <div class="footer__inner">
    <Switch/>
    </div>
  </div>
</footer>


<style>
  .footer {
    height: 4rem; 
    margin-block-start: var(--space-md);
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