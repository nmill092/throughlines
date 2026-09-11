import z from "zod";
import type { Puzzle, SolvedGroup, Tile } from "./types/puzzle";
import type { GameStatus } from "./types/game";

const VERSION = 'v1'; 
const getStorageKey = (puzzleNumber: number) => 
    `throughlines:${VERSION}:puzzle:${puzzleNumber}`;

const motionKey = `throughlines:${VERSION}:motion`; 

const SAVED_STATUS_MAP = {
      'won': 'won',
      'celebrating-win': 'won',
      'lost': 'lost',
      'revealing-loss': 'lost',
      'playing': 'playing',
      'submitting': 'playing'
  } satisfies Record<GameStatus, 'won' | 'lost' | 'playing'>; 

const tileSchema = z.object({ 
  id: z.number().int().nonnegative(), 
  position: z.number().int().nonnegative(),
  text: z.string().nonempty()
}) satisfies z.ZodType<Tile>;

const groupSchema = z.object({ 
  title: z.string().nonempty(),
  difficulty: z.union([ z.literal(1), z.literal(2), z.literal(3), z.literal(4) ]), 
  tiles: z.array(tileSchema)
}) satisfies z.ZodType<SolvedGroup>;

const saveSchema = z.object({
  status: z.enum(['playing', 'won', 'lost']),
  mistakes: z.number().int().nonnegative(), 
  solvedGroups: z.array(groupSchema), 
  lostSolution: z.array(groupSchema).nullable(),
  guessHistory: z.array(z.array(z.number().int().nonnegative())), 
  tileOrder: z.array(z.number().int())
 });

export type SavedGame = z.infer<typeof saveSchema>;

export const loadGame = (puzzleNumber: Puzzle['number']) => {
  if (typeof localStorage === 'undefined') return null; 

  try {
    const savedRaw = localStorage.getItem(getStorageKey(puzzleNumber)); 

    if(savedRaw) {
      const savedJson = JSON.parse(savedRaw); 
      if (savedJson) {
        const savedGame = saveSchema.safeParse(savedJson);
        if (savedGame.success) {
           return savedGame.data; 
        } else {
          clearGame(puzzleNumber);
        }
      }
    }
  } catch (err) {
    console.error("Failed to retrieve saved game.", { err });
    clearGame(puzzleNumber);
  }

  return null; 
}
export const saveGame = (puzzleNumber: Puzzle['number'], state: SavedGame) => {
  if (typeof localStorage === 'undefined') return; 

  try {
    const storageKey = getStorageKey(puzzleNumber);
    localStorage.setItem(storageKey, JSON.stringify(state)); 
  } catch (err) {
    console.error('Failed to save game state.', { err })
  }
}

export const clearGame = (puzzleNumber: Puzzle['number']) => {
  if (typeof localStorage === 'undefined') return; 

  try {
    const storageKey = getStorageKey(puzzleNumber); 
    localStorage.removeItem(storageKey); 
  } catch (err) {
    console.error('Failed to clear game state.', { err })
  }
}

export const getMappedSaveStatus = (status: GameStatus) => 
  SAVED_STATUS_MAP[status]; 


const motionSchema = z.object({ 
  reduced: z.boolean()
}); 

export const saveMotionPref = (reduced: boolean) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(motionKey, JSON.stringify({ reduced })); 
  } catch (err) {
    console.error('Failed to update motion preference.', { err }); 
  }
}

export const loadMotionPref = (): boolean | null => {
  if (typeof localStorage === 'undefined') return null; 
  try {
    const reduced = localStorage.getItem(motionKey); 
    if (reduced) {
      const reducedJson = JSON.parse(reduced); 
      const parsed = motionSchema.safeParse(reducedJson); 
      if (parsed.success) {
        return parsed.data.reduced; 
      } else {
        return null; 
      }
    }
  } catch (err) {
    console.error('Failed to get motion preference.', { err }); 
  }

  return null; 
}