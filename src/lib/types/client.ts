export type ClientTile = {
  id: number;
  text: string; 
  position: number; 
}

export type ClientPuzzle = {
  id: number;
  number: number; 
  tiles: ClientTile[]; 
  groupSize: 3 | 4; 
  createdAt: string;
}