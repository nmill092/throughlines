import type { Puzzle } from "./types/puzzle";

	export function toShuffled<T>(items: T[]): T[] {
		const copy = [...items];

		for (let i = copy.length - 1; i > 0; i--) {
			const idx = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[idx]] = [copy[idx], copy[i]];
		}

		return copy;
	}

export const evaluateGuess = (puzzle: Puzzle, tileIds: number[]) => {
  const guessTiles = new Set(tileIds); 

  let highCount = 0; 
  let highestCategory: Puzzle['categories'][number] | null = null; 

  for(const category of puzzle.categories) {
    const commonCount = category.tiles.filter(tile => guessTiles.has(tile.id)).length;
    if (commonCount > highCount) { 
      highCount = commonCount; 
      highestCategory = category; 
    }
  }

  if (highestCategory) {
    if (highCount === puzzle.groupSize) {
    return {
        result: 'correct',
        group: {
          title: highestCategory.title, 
          difficulty: highestCategory.difficulty, 
          tiles: highestCategory.tiles
        }
      }
    } else if (highCount === puzzle.groupSize - 1) {
      return { result: 'one-away' }
    }
  }

  return { result: 'incorrect' }
}