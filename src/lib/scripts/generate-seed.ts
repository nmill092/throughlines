import { seeds } from "$lib/puzzles/definitions";
import { authoredSeedSchema, type AuthoredPuzzle } from "$lib/puzzles/schema";
import { toShuffled } from "$lib/utils/helpers";
import { writeFileSync } from "fs";
import path from "path";
import z from "zod";

function main() {
  const parsedSeeds = authoredSeedSchema.safeParse(seeds); 
  let seedData: AuthoredPuzzle[]; 

  if (parsedSeeds.success) {
    seedData = parsedSeeds.data; 
  } else {
    console.log(z.prettifyError(parsedSeeds.error)); 
    return; 
  }

  let sql = `DELETE FROM puzzles WHERE number IN (${seedData.map(seed => seed.number).join(', ')});`; 

  let puzzleInsert = 
    `
    INSERT INTO puzzles (id, number, group_size, is_published) 
    VALUES
    `;
  let categoryInsert = 
    `
    INSERT INTO categories (id, puzzle_id, title, difficulty) 
    VALUES
    `; 
  let tileInsert = 
    `
    INSERT INTO tiles (id, category_id, text, position) 
    VALUES
    `; 

    const categories: string[] = []; 
    const tiles: string[] = [];
    const puzzles: string[] = []; 
  
  for (const puzzle of seedData) {
    const categoryTiles = puzzle.categories.flatMap(cat => {
      const categoryId = puzzle.number * 10 + cat.difficulty; 
      return cat.tiles.map((tile, idx) => ({
        categoryId, 
        tileId: categoryId * 100 + idx,
        text: tile
      }))
    }); 

    const shuffledTiles = toShuffled(categoryTiles); 
    
    puzzles.push(`(${puzzle.number}, ${puzzle.number}, ${puzzle.groupSize}, ${Number(puzzle.isPublished)})`); 
      
    for(const category of puzzle.categories) {
      const categoryId = puzzle.number * 10 + category.difficulty; 
      categories.push(`(${categoryId}, ${puzzle.number}, '${category.title.replace(/'/g, '\'\'')}', ${category.difficulty})`); 
    }

    for(const [index, tile] of shuffledTiles.entries()) {
        tiles.push(
          `(${tile.tileId}, ${tile.categoryId}, '${tile.text.replace(/'/g, '\'\'')}', ${index})`
        )
      }
  }

  puzzleInsert += puzzles.join(',\n');
  categoryInsert += categories.join(',\n');
  tileInsert += tiles.join(',\n');

  sql += `
    ${puzzleInsert}; 
    ${categoryInsert}; 
    ${tileInsert}; 
  `
  writeFileSync(path.join('src', 'lib', 'server', 'db', 'seed.sql'), sql)

}

main(); 