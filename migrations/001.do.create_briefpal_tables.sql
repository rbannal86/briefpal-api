CREATE TABLE briefpal_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT UNIQUE NOT NULL CHECK (LENGTH(user_name) > 5),
  password TEXT NOT NULL CHECK (LENGTH(password) > 6),
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE briefpal_letters (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  sender INTEGER REFERENCES briefpal_users(id) NOT NULL,
  recipient INTEGER REFERENCES briefpal_users(id),
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE briefpal_conversations (
  id SERIAL PRIMARY KEY,
  user_one INTEGER REFERENCES briefpal_users(id) NOT NULL,
  user_two INTEGER REFERENCES briefpal_users(id),
  letter_one INTEGER REFERENCES briefpal_letters(id),
  letter_two INTEGER REFERENCES briefpal_letters(id),
  letter_three INTEGER REFERENCES briefpal_letters(id),
  letter_count INTEGER CHECK (letter_count < 4) DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);