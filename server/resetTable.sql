DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      profile_pic_url VARCHAR,
      bio TEXT,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE codes (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
      id SERIAL PRIMARY KEY,
      sender INT REFERENCES users(id) NOT NULL,
      recipient INT REFERENCES users(id) NOT NULL,
      confirmed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
      id SERIAL PRIMARY KEY,
      response_to INT,
      sender INT REFERENCES users(id) NOT NULL,
      recipient INT NOT NULL,
      text TEXT NOT  NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);