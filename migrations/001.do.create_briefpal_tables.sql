CREATE TABLE briefpal_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE briefpal_letters (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  content TEXT NOT NULL,
  sender INTEGER REFERENCES briefpal_users(id) NOT NULL,
  recipient INTEGER REFERENCES briefpal_users(id)
);

CREATE TABLE briefpal_conversations (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_one INTEGER REFERENCES briefpal_users(id) NOT NULL,
  user_two INTEGER REFERENCES briefpal_users(id),
  letter_one INTEGER REFERENCES briefpal_letters(id),
  letter_two INTEGER REFERENCES briefpal_letters(id),
  letter_three INTEGER REFERENCES briefpal_letters(id),
  letter_count INTEGER CHECK (letter_count < 4) DEFAULT 1
);