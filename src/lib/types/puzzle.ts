export type Puzzle = {
  id: number; 
  number: number; 
  createdAt: string; 
  isPublished: boolean; 
  groupSize: 3 | 4; 
  categories: Category[]
}

export type Category = {
  id: number; 
  title: string; 
  difficulty: 1 | 2 | 3 | 4; 
  tiles: Tile[]; 
}

export type Tile = {
  id: number; 
  text: string; 
}