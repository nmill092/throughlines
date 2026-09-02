export type PuzzleRaw = {
  id: number;
  created_at: string; 
  group_size: 3 | 4; 
  is_published: 0 | 1; 
  number: number; 
}

export type CategoryRaw = {
  id: number; 
  puzzle_id: number;
  title: string;
  difficulty: 1 | 2 | 3 | 4; 
}

export type TileRaw = {
  id: number; 
  category_id: number; 
  text: string; 
  position: number; 
} 