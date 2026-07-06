CREATE TABLE publishers (
  publisher_id VARCHAR(16) PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  website TEXT,
  verification_status TEXT NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);

CREATE TABLE authors (
  author_id VARCHAR(16) PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE books (
  book_id VARCHAR(16) PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE book_author (
  book_id VARCHAR(16) NOT NULL,
  author_id VARCHAR(16) NOT NULL,
  PRIMARY KEY(book_id, author_id)
);
