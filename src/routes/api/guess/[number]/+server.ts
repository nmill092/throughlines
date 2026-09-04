import { getPuzzleByNumber } from "$lib/server/utils";
import { evaluateGuess } from "$lib/utils";
import { json, type RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { z } from 'zod'; 

const guessBodySchema = z.object({ 
  tileIds: z.array(z.number().int().nonnegative()).nonempty().refine(items => {
    return new Set(items).size === items.length; 
  }),
  mistakes: z.number().int().min(0).max(3)
}); 

export const POST: RequestHandler = async({ params, request, platform }) => {
  if (!platform) {
    error(500, 'Cloudflare platform unavailable');
  }

  let body: unknown; 

  try {
    body = await request.json(); 
  } catch {
    error(400, 'Invalid JSON'); 
  }

  const parsedBody = guessBodySchema.safeParse(body); 

  if (!parsedBody.success) {
    error(400, 'Bad request'); 
  }

  const { tileIds } = parsedBody.data; 

  const number = Number(params.number); 

  if (!Number.isInteger(number)) {
    error(400, 'Bad request'); 
  }

  const puzzle = await getPuzzleByNumber(number, platform.env.DB); 
  
  if (!puzzle || !puzzle.isPublished) {
    error(404, 'Puzzle not found'); 
  }

  const puzzleTiles = puzzle.categories.flatMap(c => c.tiles).map(t => t.id); 

  if (
    !(puzzle.groupSize === tileIds.length) ||
    !(tileIds.every(id => puzzleTiles.includes(id)))
  ) {
    error(400, 'Request contains malformed groups'); 
  }

  const result = await evaluateGuess(puzzle, tileIds); 

  if (parsedBody.data.mistakes === 3 && (result.result === 'incorrect' || result.result === 'one-away')) {
    result.solution = puzzle.categories.map(category => ({
      difficulty: category.difficulty, 
      title: category.title, 
      tiles: category.tiles
    }))
  }

  return json(result); 
}; 