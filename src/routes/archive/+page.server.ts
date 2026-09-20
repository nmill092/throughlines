import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getAllPublishedPuzzles } from "$lib/server/utils.js";

export const load: PageServerLoad = async({ platform }) => {
   if (!platform) {
    error(500, 'Could not access Cloudflare platform.'); 
  }

  const publishedPuzzleNums = await getAllPublishedPuzzles(platform.env.DB); 

  return {
    puzzles: publishedPuzzleNums
  }
}