<script lang="ts">
  let { data } = $props();
  
  let tiles = $state(data.puzzle.tiles);
</script>

<ul>
  {#each tiles as tile (tile.id)}
    <li>{tile.text}</li>
  {/each}
</ul>