INSERT INTO puzzles (id, group_size, is_published, number)
VALUES (1, 4, 1, 1);

INSERT INTO categories (id, puzzle_id, title, difficulty)
VALUES
  (1, 1, 'Britishisms', 2),
  (2, 1, 'First Words of State Nicknames', 4),
  (3, 1, 'Movements with "-ism"', 1),
  (4, 1, 'The Broad Brushstrokes', 3);

INSERT INTO tiles (id, category_id, text, position) 
VALUES
  (1, 1, "tyre", 0),
  (2, 1, "lift", 1),
  (3, 1, "boot", 4),
  (4, 1, "flat", 11),
  (5, 2, "lone", 2),
  (6, 2, "sunshine", 5),
  (7, 2, "garden", 3),
  (8, 2, "aloha", 14),
  (9, 3, "brutal", 6),
  (10, 3, "real", 10),
  (11, 3, "dada", 8),
  (12, 3, "minimal", 13),
  (13, 4, "gist", 12),
  (14, 4, "drift", 15),
  (15, 4, "picture", 7),
  (16, 4, "idea", 9);