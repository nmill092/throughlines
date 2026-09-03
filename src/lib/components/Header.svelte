<script lang="ts">
	import logo from '$lib/assets/throughlineslogo.svg';
</script>

<header class="header">
	<div class="container--wide">
		<div class="header__inner">
			<div class="header__logo">
				<a href="/" aria-label="Throughlines home">
					<img src={logo} alt="" width="300" height="76" />
				</a>
			</div>
      <a href="/archive" class="header__archive-btn pill">
        Puzzle Archive
      </a>  
		</div>
	</div>
</header>

<style>
  .header {
		margin-block-start: var(--space-lg);
		
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

  .header__archive-btn {
    --border: transparent; 
    --px: var(--space-md);

    align-self: center; 
    background-color: var(--color-yellow);
    text-transform: uppercase; 
    font-weight: 800;
    text-wrap: nowrap; 
    font-size: var(--fs-s);
    letter-spacing: -5%; 
    transition: 
      scale .4s linear(0, 0.528 7%, 0.921 14.4%, 1.07 18.3%, 1.19 22.4%, 1.28 26.7%, 1.34 31.2%, 1.366 34.5%, 1.378 38%, 1.377 41.7%, 1.363 45.6%, 1.308 53.3%, 1.13 71.3%, 1.059 80.1%, 1.013 89.7%, 1), 
      rotate .4s linear(0, 0.528 7%, 0.921 14.4%, 1.07 18.3%, 1.19 22.4%, 1.28 26.7%, 1.34 31.2%, 1.366 34.5%, 1.378 38%, 1.377 41.7%, 1.363 45.6%, 1.308 53.3%, 1.13 71.3%, 1.059 80.1%, 1.013 89.7%, 1); 
    width: clamp(12rem, 9vw + .5em, 20rem);
    &:hover {
      scale: 1.03; 
      rotate: 1deg; 
    }
  }

  @media (width >= 32rem) {
    .header__inner {
      justify-content: space-between;
      gap: var(--space-xs);
    }
  }
</style>