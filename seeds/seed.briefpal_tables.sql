BEGIN;

TRUNCATE
  briefpal_conversations,
  briefpal_letters,
  briefpal_users
  RESTART IDENTITY CASCADE;

INSERT INTO briefpal_users (user_name, password)
VALUES
  ('userOne', '$2a$12$fbk6DbW.GGoAXh6qp40xoeb6rt4KTgnUtivYX6Rda37.Hqkghha1G'),
  ('userTwo', 'passwordtwo'),
  ('userThree', 'passwordthree'),
  ('userFour', 'passwordfour'),
  ('userFive', 'passwordfive');

INSERT INTO briefpal_letters (content, sender, recipient)
VALUES
  ('Hello, this is a test', 1, 2),
  ('This is also a test, hello!', 1, 5),
  ('Testing, testing, 1, 2, 3...', 2, 1),
  ('Testaroni, testaroni, give me the testamoli', 3, 1),
  ('Is this thing on?', 5, 1),
  ('Yes, it is!', 1, 5);

INSERT INTO briefpal_conversations (user_one, user_two, letter_one, letter_two, letter_three, letter_count)
VALUES
  (1, 5, 2, 5, 6, 3),
  (2, 4, 3, null, null, 1),
  (1, 2, 1, 3, null, 2),
  (3, 1, 4, null, null, 1);

COMMIT;