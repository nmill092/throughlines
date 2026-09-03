import {type CategoryRaw, type TileRaw, type PuzzleRaw } from "$lib/types/db";
import type { Category, Puzzle } from "$lib/types/puzzle";

export const getPuzzleByNumber = async (number: number, db: D1Database): Promise<Puzzle | null>  => {
  const puzzleRow = await db.prepare(`
      SELECT id, group_size, is_published, number, created_at
      FROM puzzles
      WHERE number = ? 
    `)
    .bind(number)
    .first<PuzzleRaw>(); 

  if (!puzzleRow) return null; 

  const puzzleId = puzzleRow.id; 

  const categoryRows = await db.prepare(`
      SELECT id, difficulty, puzzle_id, title
      FROM categories
      WHERE puzzle_id = ?
      ORDER BY difficulty
    `)
    .bind(puzzleId)
    .all<CategoryRaw>(); 
    

  const tileRows = await db.prepare(`
      SELECT t.id, t.text, t.position, t.category_id
      FROM tiles t
      JOIN categories c ON t.category_id = c.id
      WHERE c.puzzle_id = ? 
    `)
    .bind(puzzleId)
    .all<TileRaw>(); 

    const categoriesWithTiles: Category[] = categoryRows.results.map(row => ({
      ...row, 
      tiles: tileRows
        .results
        .filter(cId => cId.category_id === row.id)
        .map(tile => {
          const {category_id, ...rest} = tile;
          return rest    
        })
    }));

    return { 
      id: puzzleId, 
      number: puzzleRow.number,
      createdAt: puzzleRow.created_at, 
      isPublished: Boolean(puzzleRow.is_published),
      groupSize: puzzleRow.group_size, 
      categories: categoriesWithTiles
    }
}
