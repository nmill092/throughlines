import z from "zod";
import type { Puzzle, SolvedGroup, Tile } from "./types/puzzle";
import type { GameStatus } from "./types/game";

const VERSION = 'v1'; 

const storeKey = `throughlines:${VERSION}:games`; 

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
  correctGuesses: z.number().int().nonnegative(),
  solvedGroups: z.array(groupSchema), 
  lostSolution: z.array(groupSchema).nullable(),
  guessHistory: z.array(z.array(z.number().int().nonnegative())), 
  tileOrder: z.array(z.number().int())
 });

 const entrySchema = saveSchema.extend({
  updatedAt: z.number().int().nonnegative()
 })

 const storeSchema = z.object({ 
  games: z.record(z.string(), z.unknown())
 }); 

export type SavedGame = z.infer<typeof saveSchema>;

type Store = { 
  games: Record<string, z.infer<typeof entrySchema>>
}; 

const readStore = (): Store => {
  if (typeof localStorage === 'undefined') return { games: {} }; 

  try { 
    const raw = localStorage.getItem(storeKey); 
    if (!raw) return { games: {} }; 
    const outer = storeSchema.safeParse(JSON.parse(raw)); 
    if (!outer.success) { 
      localStorage.removeItem(storeKey);
      return { games: {} }; 
    }

    const games: Store['games'] = {}; 
    for (const [number, value] of Object.entries(outer.data.games)) {
      const gameData = entrySchema.safeParse(value);
      if (gameData.success) {
        games[number] = gameData.data; 
      }
    }
    return { games }; 
  } catch (err) {
    console.error('Failed to read game store', { err }); 
    localStorage.removeItem(storeKey);
    return { games: {} }; 
  }
}

const writeStore = (store: Store) => {
  if (typeof localStorage === 'undefined') return; 
  try {
    localStorage.setItem(storeKey, JSON.stringify(store)); 
  } catch (err) {
    console.error('Failed to save game state.', { err }); 
  }
}

export const loadAllGames = () => 
  readStore().games ?? null; 

export const loadGame = (puzzleNumber: Puzzle['number']) => {
  return readStore().games[String(puzzleNumber)] ?? null; 
}

export const saveGame = (puzzleNumber: Puzzle['number'], state: SavedGame) => {
  const store = readStore(); 
  store.games[String(puzzleNumber)] = { ...state, updatedAt: Date.now() }
  writeStore(store); 
} 

 export const clearGame = (puzzleNumber: Puzzle['number']) => {
    const store = readStore();
    delete store.games[String(puzzleNumber)];
    writeStore(store);
  };

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

