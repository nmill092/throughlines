import type { GuessResponse, Puzzle } from "../types/puzzle";

	export function toShuffled<T>(items: T[]): T[] {
		const copy = [...items];

		for (let i = copy.length - 1; i > 0; i--) {
			const idx = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[idx]] = [copy[idx], copy[i]];
		}

		return copy;
	}

export	const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));