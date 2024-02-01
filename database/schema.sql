set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userID" serial PRIMARY KEY,
  "firstName" text,
  "lastName" text,
  "email" text,
  "username" text,
  "hashedPassword" text,
  "createdAt" timestamptz(3) default current_timestamp
);

CREATE TABLE "messages" (
  "messageID" serial PRIMARY KEY,
  "conversationID" text,
  "userID" integer,
  "messageContent" text,
  "timestamp" timestamptz(3) default current_timestamp
);

CREATE TABLE "conversations" (
  "conversationID" text,
  "userID" integer,
  PRIMARY KEY ("conversationID", "userID")
);

CREATE TABLE "friendships" (
  "friendshipID" serial PRIMARY KEY,
  "userID1" integer,
  "userID2" integer
);

CREATE TABLE "requests" (
  "requestID" serial PRIMARY KEY,
  "senderID" integer,
  "receiverID" integer,
  "timestamp" timestamptz(3) default current_timestamp
);

ALTER TABLE "conversations" ADD FOREIGN KEY ("userID") REFERENCES "users" ("userID");

ALTER TABLE "messages" ADD FOREIGN KEY ("userID") REFERENCES "users" ("userID")
;
ALTER TABLE "messages" ADD FOREIGN KEY ("conversationID", "userID") REFERENCES "conversations" ("conversationID", "userID");

ALTER TABLE "requests" ADD FOREIGN KEY ("senderID") REFERENCES "users" ("userID");

ALTER TABLE "requests" ADD FOREIGN KEY ("receiverID") REFERENCES "users" ("userID");

ALTER TABLE "friendships" ADD FOREIGN KEY ("userID1") REFERENCES "users" ("userID");

ALTER TABLE "friendships" ADD FOREIGN KEY ("userID2") REFERENCES "users" ("userID");
