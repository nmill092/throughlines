import z from "zod";

const authoredCategorySchema = z.object({
  title: z.string().trim().nonempty({ error: 'Title cannot be empty.'}),
  difficulty: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4)
  ], { error: 'Group difficulties must be between 1-4!'}),
  tiles: z.array(z.string().trim().toLowerCase().nonempty())
})

export const authoredPuzzleSchema = z.object({
  number: z.number().int().positive(),
  groupSize: z.union([z.literal(3), z.literal(4)], { error: 'Group size must be 3 or 4.'}),
  isPublished: z.boolean(),
  categories: z.array(authoredCategorySchema)
}).superRefine((data, ctx) => {

  // correct # categories with no duplicate titles 
  if (data.categories.length !== 4) {
    ctx.addIssue({
      code: 'custom',
      message: `Wrong number of categories! The puzzle should have 4 categories.`,
      input: data.categories
    });
  }

  const categoryTitles = data.categories.map(cat => cat.title); 
  if (new Set(categoryTitles).size !== categoryTitles.length) {
    ctx.addIssue({
      code: 'custom',
      message: `Duplicate category titles not allowed.`,
      input: data.categories
    });
  }

  // correct # difficulties with no duplicates 
  const difficulties = data.categories.map(cat => cat.difficulty);
  const numDifficulties = new Set(difficulties).size;

  if (numDifficulties !== data.categories.length) {
    ctx.addIssue({
      code: 'custom',
      message: 'Duplicate difficulties not allowed',
      input: data.categories
    });
  }

  // correct # tiles with no duplicates 
  if(!(data.categories.every(cat => cat.tiles.length === data.groupSize))) {
    ctx.addIssue({
      code: 'custom',
      message: `Each category must have ${data.groupSize} tiles.`,
      input: data.categories
    })
  }

  const tilesFlat = data.categories.flatMap(cat => cat.tiles); 
  if (new Set(tilesFlat).size !== tilesFlat.length) {
    ctx.addIssue({
      code: 'custom',
      message: 'Duplicate tiles not allowed.',
      input: tilesFlat
    });
  }
});

  export const authoredSeedSchema = z.array(authoredPuzzleSchema).superRefine((puzzles,ctx) => {
    const numbers = puzzles.map(p => p.number);
    const dupes = [...new Set(numbers.filter((n, i) => numbers.indexOf(n) !== i))];
    if (dupes.length) {
      ctx.addIssue({ code: 'custom', message: `Duplicate puzzle numbers: ${dupes.join(',')}` });
    }
  });

export type AuthoredPuzzle = z.infer<typeof authoredPuzzleSchema>; 