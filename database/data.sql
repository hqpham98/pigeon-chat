-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

INSERT INTO "users" ("firstName", "lastName", "email", "username", "hashedPassword")
VALUES ('Bobby', 'Lee', 'taco@gmail.com', 'username', '$argon2i$v=19$m=4096,t=3,p=1$drFII7yZuHIyUFi8H+ei/A$0qzEImYgUE97RaUS4e+dh8mtxWibq3vmmU0FWABsnEE'), ('Henry', 'Pham', 'asdfadsf@gmail.com', 'henry', '$argon2i$v=19$m=4096,t=3,p=1$cSZGXBbtgw/czkO4+QvCqw$rF1gUTisBVdQJsFlJWNeQNRKIYqEi9X6Sj3pON7FudY');

INSERT INTO "friendships" ("userID1", "userID2")
VALUES (1, 2), (2, 1);

INSERT INTO "conversations" ("conversationID", "userID")
VALUES ('0e8bbd6e-d33a-4f44-a8c7-414fec627f0d', 1), ('0e8bbd6e-d33a-4f44-a8c7-414fec627f0d', 2);

INSERT INTO "messages" ("conversationID", "userID", "messageContent", "timestamp")
VALUES  ('0e8bbd6e-d33a-4f44-a8c7-414fec627f0d', 1, 'username: Hi Henry', '2024-02-21T21:13:56.212Z'), ('0e8bbd6e-d33a-4f44-a8c7-414fec627f0d', 2, 'henry: Hi Bobby', '2024-02-21T21:14:32.235Z');
