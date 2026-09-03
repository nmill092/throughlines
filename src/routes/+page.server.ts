import { type PuzzleRaw } from "$lib/types/db";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ platform }) => {

  if(!platform) {
    error(400, 'Cloudflare platform unavailable.'); 
  }

  const db = platform.env.DB; 

  const puzzle = await db.prepare(`
      SELECT number FROM puzzles
      WHERE is_published = 1
      ORDER BY number DESC
      LIMIT 1
  `).first<PuzzleRaw>(); 

  if (!puzzle) {
    error(404, 'No puzzles have been published.'); 
  }

  const number = puzzle.number; 

  redirect(307, `/play/${number}`);
}