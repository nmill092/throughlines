import { getPuzzleByNumber } from "$lib/server/utils";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { ClientPuzzle } from "$lib/types/client";

export const load: PageServerLoad = async ({ params, platform }) => {

  if (!platform) {
    error(500, 'Could not access Cloudflare platform.'); 
  }

  const db = platform.env.DB; 
  const number = Number(params.number); 

  if (!Number.isInteger(number)) {
    error(400, 'Bad request: Puzzle number must be of type number.')
  }

  const puzzle = await getPuzzleByNumber(number, db); 

  if (!puzzle) {
    error(404, 'Puzzle not found.')
  }

  const sortedTiles = puzzle.categories
    .flatMap(c => c.tiles)
    .sort((a, b) => a.position > b.position ? 1 : -1)


  return { 
    puzzle: {
      id: puzzle.id,
      number: puzzle.number,
      groupSize: puzzle.groupSize, 
      createdAt: puzzle.createdAt,
      tiles: sortedTiles, 
    } satisfies ClientPuzzle
  }
}