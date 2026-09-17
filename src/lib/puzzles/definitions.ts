import type { AuthoredPuzzle } from "./schema";

export const seeds: AuthoredPuzzle[] = [
  { 
    number: 2, 
    groupSize: 4, 
    isPublished: true, 
    categories: [
        {
            title: "Two-letter French words",
            difficulty: 2, 
            tiles: ['au', 'du', 'ne', 'je']
        },
        {
            title: 'Abbreviations for muscle groups',
            difficulty: 1, 
            tiles: ['ab', 'lat', 'trap', 'delt']
        },
        {
            title: 'Stock market-related words',
            difficulty: 3, 
            tiles: ['long', 'short', 'share', 'ipo']
        },
         {
            title: 'On the ____',
            difficulty: 4, 
            tiles: ['dl', 'move', 'bubble', 'mend']
        }
    ]
  },
  { 
    number: 3, 
    groupSize: 4, 
    isPublished: true, 
    categories: [
        {
            title: 'Nothing at all',
            difficulty: 1, 
            tiles: ['squat', 'zilch', 'zip', 'jack']
        },
        {
            title: 'Fail to make up one\'s mind',
            difficulty: 3, 
            tiles: ['waffle', 'dally', 'hedge', 'waver']
        },
        {
            title: 'Family ____',
            difficulty: 2, 
            tiles: ['tree', 'heirloom', 'affair', 'man']
        },
         {
            title: 'Words from Prince titles',
            difficulty: 4, 
            tiles: ['purple', 'corvette', 'doves', 'darling']
        }
    ]
  },
  { 
    number: 4, 
    groupSize: 4, 
    isPublished: true, 
    categories: [
        {
            title: 'The relevant information',
            difficulty: 2, 
            tiles: ['lowdown', 'skinny', '411', 'tea']
        },
        {
            title: 'Words for "destiny" without final letter',
            difficulty: 4, 
            tiles: ['fat', 'lo', 'kisme', 'fortun']
        },
        {
            title: 'Club hits of the 2000s and 2010s',
            difficulty: 3, 
            tiles: ['yeah!', 'toxic', 'tik tok', 'low']
        },
         {
            title: 'Compound nouns starting with body parts',
            difficulty: 1, 
            tiles: ['facebook', 'mouthpiece', 'footnote', 'handout']
        }
    ]
  }
]