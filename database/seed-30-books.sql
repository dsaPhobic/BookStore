-- Adds 30 catalog books for pagination testing.
-- Safe to run more than once: titles, authors, genres and relations are checked first.
-- Cover images intentionally remain NULL so they can be uploaded to Cloudinary later.

BEGIN TRANSACTION;

INSERT INTO "Genre" ("GenreName") SELECT 'Programming' WHERE NOT EXISTS (SELECT 1 FROM "Genre" WHERE "GenreName" = 'Programming');
INSERT INTO "Genre" ("GenreName") SELECT 'Sci-Fi & Fantasy' WHERE NOT EXISTS (SELECT 1 FROM "Genre" WHERE "GenreName" = 'Sci-Fi & Fantasy');
INSERT INTO "Genre" ("GenreName") SELECT 'Business & Strategy' WHERE NOT EXISTS (SELECT 1 FROM "Genre" WHERE "GenreName" = 'Business & Strategy');
INSERT INTO "Genre" ("GenreName") SELECT 'Psychology' WHERE NOT EXISTS (SELECT 1 FROM "Genre" WHERE "GenreName" = 'Psychology');
INSERT INTO "Genre" ("GenreName") SELECT 'Classic Fiction' WHERE NOT EXISTS (SELECT 1 FROM "Genre" WHERE "GenreName" = 'Classic Fiction');

INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'George Orwell', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'George Orwell');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'J.R.R. Tolkien', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'J.R.R. Tolkien');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Cal Newport', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Cal Newport');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Erich Gamma', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Erich Gamma');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Steve McConnell', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Steve McConnell');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Frederick P. Brooks Jr.', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Frederick P. Brooks Jr.');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Steve Krug', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Steve Krug');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Gene Kim', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Gene Kim');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Nicole Forsgren', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Nicole Forsgren');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Eric Ries', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Eric Ries');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Peter Thiel', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Peter Thiel');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Morgan Housel', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Morgan Housel');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Jim Collins', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Jim Collins');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Viktor E. Frankl', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Viktor E. Frankl');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Frank Herbert', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Frank Herbert');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Isaac Asimov', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Isaac Asimov');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Aldous Huxley', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Aldous Huxley');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Ursula K. Le Guin', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Ursula K. Le Guin');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Jane Austen', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Jane Austen');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Fyodor Dostoevsky', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Fyodor Dostoevsky');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'J.D. Salinger', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'J.D. Salinger');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Sun Tzu', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Sun Tzu');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Brian Christian', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Brian Christian');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Ray Bradbury', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Ray Bradbury');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Yuval Noah Harari', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Yuval Noah Harari');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Robert C. Martin', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Robert C. Martin');
INSERT INTO "Author" ("AuthorName", "CreatedAt", "IsFeatured") SELECT 'Joshua Bloch', datetime('now'), 0 WHERE NOT EXISTS (SELECT 1 FROM "Author" WHERE "AuthorName" = 'Joshua Bloch');

INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT '1984', 'A dystopian classic about surveillance, truth, and individual freedom.', 289, 1949, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = '1984');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Animal Farm', 'A political fable about power, revolution, and corruption.', 219, 1945, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Animal Farm');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Hobbit', 'A reluctant hobbit joins an adventure to reclaim a lost kingdom.', 459, 1937, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Hobbit');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Lord of the Rings', 'An epic journey to destroy a powerful ring and save Middle-earth.', 799, 1954, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Lord of the Rings');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Deep Work', 'Practical strategies for focused work in a distracted world.', 369, 2016, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Deep Work');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Digital Minimalism', 'A philosophy for using technology with greater intention.', 349, 2019, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Digital Minimalism');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Design Patterns', 'Reusable object-oriented solutions to recurring software design problems.', 679, 1994, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Design Patterns');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Code Complete', 'A practical handbook of software construction and engineering craft.', 599, 2004, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Code Complete');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Mythical Man-Month', 'Classic essays on software project management and complexity.', 429, 1975, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Mythical Man-Month');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Don''t Make Me Think', 'A concise guide to intuitive web usability and user experience.', 329, 2000, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Don''t Make Me Think');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Phoenix Project', 'A business novel about DevOps, flow, and modern IT operations.', 399, 2013, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Phoenix Project');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Accelerate', 'Research-backed capabilities for high-performing technology organizations.', 449, 2018, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Accelerate');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Lean Startup', 'An iterative approach to building products under uncertainty.', 359, 2011, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Lean Startup');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Zero to One', 'Ideas for building distinctive companies and creating new value.', 339, 2014, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Zero to One');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Psychology of Money', 'Lessons about behavior, wealth, risk, and long-term financial decisions.', 319, 2020, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Psychology of Money');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Good to Great', 'Research on how companies move from average to exceptional performance.', 389, 2001, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Good to Great');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Man''s Search for Meaning', 'A psychiatrist reflects on resilience, purpose, and human freedom.', 279, 1946, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Man''s Search for Meaning');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Dune', 'Political intrigue and survival on the desert planet Arrakis.', 550, 1965, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Dune');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Foundation', 'Scientists preserve knowledge as a galactic empire begins to collapse.', 349, 1951, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Foundation');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Brave New World', 'A dystopian vision of engineered happiness and social control.', 269, 1932, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Brave New World');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Left Hand of Darkness', 'A science-fiction study of identity, culture, and political trust.', 329, 1969, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Left Hand of Darkness');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Pride and Prejudice', 'A classic novel of manners, family, and unexpected romance.', 249, 1813, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Pride and Prejudice');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Crime and Punishment', 'A psychological novel about guilt, morality, and redemption.', 379, 1866, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Crime and Punishment');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Catcher in the Rye', 'A coming-of-age story about alienation and authenticity.', 279, 1951, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Catcher in the Rye');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'The Art of War', 'Strategic principles for conflict, leadership, and preparation.', 199, -500, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'The Art of War');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Algorithms to Live By', 'Computer science ideas applied to everyday decisions and human behavior.', 419, 2016, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Algorithms to Live By');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Fahrenheit 451', 'A future where books are forbidden and independent thought is suppressed.', 289, 1953, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Fahrenheit 451');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Homo Deus', 'An exploration of possible futures for humanity and technology.', 479, 2015, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Homo Deus');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Clean Code', 'Practical principles for writing readable and maintainable software.', 549, 2008, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Clean Code');
INSERT INTO "Book" ("Title", "Description", "Price", "PublishedYear", "Status", "CreatedAt") SELECT 'Effective Java', 'Best practices for designing robust and maintainable Java programs.', 619, 2018, 'Active', datetime('now') WHERE NOT EXISTS (SELECT 1 FROM "Book" WHERE "Title" = 'Effective Java');

-- Primary author and genre for each seeded title.
CREATE TEMP TABLE "SeedBookLinks" ("Title" TEXT, "AuthorName" TEXT, "GenreName" TEXT);
INSERT INTO "SeedBookLinks" VALUES
('1984', 'George Orwell', 'Classic Fiction'),
('Animal Farm', 'George Orwell', 'Classic Fiction'),
('The Hobbit', 'J.R.R. Tolkien', 'Sci-Fi & Fantasy'),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Sci-Fi & Fantasy'),
('Deep Work', 'Cal Newport', 'Business & Strategy'),
('Digital Minimalism', 'Cal Newport', 'Psychology'),
('Design Patterns', 'Erich Gamma', 'Programming'),
('Code Complete', 'Steve McConnell', 'Programming'),
('The Mythical Man-Month', 'Frederick P. Brooks Jr.', 'Programming'),
('Don''t Make Me Think', 'Steve Krug', 'Programming'),
('The Phoenix Project', 'Gene Kim', 'Programming'),
('Accelerate', 'Nicole Forsgren', 'Programming'),
('The Lean Startup', 'Eric Ries', 'Business & Strategy'),
('Zero to One', 'Peter Thiel', 'Business & Strategy'),
('The Psychology of Money', 'Morgan Housel', 'Psychology'),
('Good to Great', 'Jim Collins', 'Business & Strategy'),
('Man''s Search for Meaning', 'Viktor E. Frankl', 'Psychology'),
('Dune', 'Frank Herbert', 'Sci-Fi & Fantasy'),
('Foundation', 'Isaac Asimov', 'Sci-Fi & Fantasy'),
('Brave New World', 'Aldous Huxley', 'Classic Fiction'),
('The Left Hand of Darkness', 'Ursula K. Le Guin', 'Sci-Fi & Fantasy'),
('Pride and Prejudice', 'Jane Austen', 'Classic Fiction'),
('Crime and Punishment', 'Fyodor Dostoevsky', 'Classic Fiction'),
('The Catcher in the Rye', 'J.D. Salinger', 'Classic Fiction'),
('The Art of War', 'Sun Tzu', 'Classic Fiction'),
('Algorithms to Live By', 'Brian Christian', 'Programming'),
('Fahrenheit 451', 'Ray Bradbury', 'Sci-Fi & Fantasy'),
('Homo Deus', 'Yuval Noah Harari', 'Psychology'),
('Clean Code', 'Robert C. Martin', 'Programming'),
('Effective Java', 'Joshua Bloch', 'Programming');

INSERT INTO "BookAuthor" ("BookId", "AuthorId")
SELECT b."Id", a."Id"
FROM "SeedBookLinks" s
JOIN "Book" b ON b."Title" = s."Title"
JOIN "Author" a ON a."AuthorName" = s."AuthorName"
WHERE NOT EXISTS (
    SELECT 1 FROM "BookAuthor" ba
    WHERE ba."BookId" = b."Id" AND ba."AuthorId" = a."Id"
);

INSERT INTO "BookGenre" ("BookId", "GenreId")
SELECT b."Id", g."Id"
FROM "SeedBookLinks" s
JOIN "Book" b ON b."Title" = s."Title"
JOIN "Genre" g ON g."GenreName" = s."GenreName"
WHERE NOT EXISTS (
    SELECT 1 FROM "BookGenre" bg
    WHERE bg."BookId" = b."Id" AND bg."GenreId" = g."Id"
);

DROP TABLE "SeedBookLinks";
COMMIT;

-- Expected result for the database shown by the project: 40 books.
SELECT COUNT(*) AS "TotalBooks" FROM "Book";
