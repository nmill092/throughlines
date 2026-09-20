<script lang="ts">
	import logo from '$lib/assets/throughlineslogo.svg';
</script>

<header class="header">
	<div class="container">
		<div class="header__inner">
			<div class="header__logo">
				<a href="/" aria-label="Throughlines home">
					<img src={logo} alt="" width="300" height="76" />
				</a>
			</div>
		</div>
	</div>
</header>

<style>
  .header {
		padding-block: var(--space-xs);
    display: flex;
    align-items: center;
    background: oklch(from var(--color-paper) calc(l - .02) c h);    
	}
  .header__inner {
    display: flex;
		justify-content: center;
    row-gap: var(--space-xs);
    flex-wrap: wrap; 
    align-items: center;
  }

	.header__logo {
		width: clamp(13rem, 20vw, 25rem);
		height: auto;
	}
</style>