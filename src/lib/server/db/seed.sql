DELETE FROM puzzles WHERE number IN (2, 3, 4);
    
    INSERT INTO puzzles (id, number, group_size, is_published) 
    VALUES
    (2, 2, 4, 1),
(3, 3, 4, 1),
(4, 4, 4, 1); 
    
    INSERT INTO categories (id, puzzle_id, title, difficulty) 
    VALUES
    (22, 2, 'Two-letter French words', 2),
(21, 2, 'Abbreviations for muscle groups', 1),
(23, 2, 'Stock market-related words', 3),
(24, 2, 'On the ____', 4),
(31, 3, 'Nothing at all', 1),
(33, 3, 'Fail to make up one''s mind', 3),
(32, 3, 'Family ____', 2),
(34, 3, 'Words from Prince titles', 4),
(42, 4, 'The relevant information', 2),
(44, 4, 'Words for "destiny" without final letter', 4),
(43, 4, 'Club hits of the 2000s and 2010s', 3),
(41, 4, 'Compound nouns starting with body parts', 1); 
    
    INSERT INTO tiles (id, category_id, text, position) 
    VALUES
    (2200, 22, 'au', 0),
(2203, 22, 'je', 1),
(2102, 21, 'trap', 2),
(2202, 22, 'ne', 3),
(2101, 21, 'lat', 4),
(2300, 23, 'long', 5),
(2201, 22, 'du', 6),
(2302, 23, 'share', 7),
(2100, 21, 'ab', 8),
(2103, 21, 'delt', 9),
(2403, 24, 'mend', 10),
(2303, 23, 'ipo', 11),
(2400, 24, 'dl', 12),
(2402, 24, 'bubble', 13),
(2301, 23, 'short', 14),
(2401, 24, 'move', 15),
(3203, 32, 'man', 0),
(3302, 33, 'hedge', 1),
(3102, 31, 'zip', 2),
(3301, 33, 'dally', 3),
(3303, 33, 'waver', 4),
(3201, 32, 'heirloom', 5),
(3101, 31, 'zilch', 6),
(3400, 34, 'purple', 7),
(3200, 32, 'tree', 8),
(3300, 33, 'waffle', 9),
(3103, 31, 'jack', 10),
(3202, 32, 'affair', 11),
(3402, 34, 'doves', 12),
(3401, 34, 'corvette', 13),
(3403, 34, 'darling', 14),
(3100, 31, 'squat', 15),
(4102, 41, 'footnote', 0),
(4203, 42, 'tea', 1),
(4103, 41, 'handout', 2),
(4101, 41, 'mouthpiece', 3),
(4200, 42, 'lowdown', 4),
(4400, 44, 'fat', 5),
(4201, 42, 'skinny', 6),
(4402, 44, 'kisme', 7),
(4300, 43, 'yeah!', 8),
(4401, 44, 'lo', 9),
(4403, 44, 'fortun', 10),
(4303, 43, 'low', 11),
(4100, 41, 'facebook', 12),
(4202, 42, '411', 13),
(4302, 43, 'tik tok', 14),
(4301, 43, 'toxic', 15); 
  