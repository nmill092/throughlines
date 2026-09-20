<script lang="ts">
	import githubLogo from '$lib/assets/github.svg';
	import Switch from './Switch.svelte';
</script>

<footer class="footer">
	<div class="container">
		<div class="footer__inner">
			<Switch />
			<div class="footer__right">
				<a href="/archive" class="footer__archive-btn pill"> Puzzle Archive </a>
				<div class="footer__github">
					<a
						href="https://github.com/nmill092/throughlines"
						target="_blank"
						aria-label="Throughlines Github repository"
					>
						<img src={githubLogo} alt="" width="70" height="70" />
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding-block: 0.5rem;
		margin-block-start: var(--space-md);
		background-color: var(--color-accent);
		display: flex;
		align-items: center;
	}

	.footer__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.footer__archive-btn {
		--border: var(--offblack);
		--px: var(--space-md);

		align-self: center;
		text-transform: uppercase;
		font-weight: 800;
		text-wrap: nowrap;
		font-size: var(--fs-s);
		letter-spacing: -5%;
		transition:
			scale 0.4s
				linear(
					0,
					0.528 7%,
					0.921 14.4%,
					1.07 18.3%,
					1.19 22.4%,
					1.28 26.7%,
					1.34 31.2%,
					1.366 34.5%,
					1.378 38%,
					1.377 41.7%,
					1.363 45.6%,
					1.308 53.3%,
					1.13 71.3%,
					1.059 80.1%,
					1.013 89.7%,
					1
				),
			rotate 0.4s
				linear(
					0,
					0.528 7%,
					0.921 14.4%,
					1.07 18.3%,
					1.19 22.4%,
					1.28 26.7%,
					1.34 31.2%,
					1.366 34.5%,
					1.378 38%,
					1.377 41.7%,
					1.363 45.6%,
					1.308 53.3%,
					1.13 71.3%,
					1.059 80.1%,
					1.013 89.7%,
					1
				);
		width: clamp(12rem, 9vw + 0.5em, 20rem);
		&:hover {
			scale: 1.03;
			rotate: 1deg;
		}
	}

	.footer__github {
		width: 30px;
		height: auto;
	}

	.footer__right {
		display: flex;
		gap: 0.5rem;
	}
</style>
