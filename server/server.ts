/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Message, SocketClientDict, FriendRequest } from './lib/types';
// fix types

import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;

const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://www.pigeonchat.xyz/'
        : 'http://localhost:5173',
  },
});

// List of active socket connections
const socketClientDict: SocketClientDict = {};

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// Get all conversations involving userID
app.get('/api/pigeon/conversations/:userID', async (req, res) => {
  const { userID } = req.params;
  const sql = `
    SELECT "conversationID"
    FROM "conversations"
    WHERE "userID" = $1;`;
  const params = [userID];
  const result = await db.query(sql, params);
  res.json(result.rows);
});

// Get all messages in a conversation
app.get('/api/pigeon/messages/:conversationID', async (req, res) => {
  const { conversationID } = req.params;
  const sql = `
    SELECT "messages"."messageID", "messages"."messageContent", "messages"."timestamp", "messages"."userID", "users"."username", "users"."firstName", "users"."lastName"
    FROM "messages"
    JOIN "users" ON "users"."userID" = "messages"."userID"
    WHERE "messages"."conversationID" = $1
    ORDER by "timestamp" ASC;`;
  const params = [conversationID];
  const result = await db.query(sql, params);
  console.log('received get');
  res.json(result.rows);
});

// Get all friends (userID and firstName) for userID
app.get('/api/pigeon/friendships/:userID', async (req, res) => {
  const { userID } = req.params;
  const sql = `
    SELECT "friendships"."userID2" as "userID", "users"."username", "users"."firstName", "users"."lastName"
    FROM "friendships"
    JOIN "users" ON "friendships"."userID2" = "users"."userID"
    WHERE "friendships"."userID1" = $1;`;
  const params = [userID];
  const result = await db.query(sql, params);
  res.json(result.rows);
});

/**
 * Get user info
 * Given username, get Person (userID, username, firstName, lastName)
 */

app.get('/api/pigeon/users/:username', async (req, res) => {
  const { username } = req.params;
  const sql = `
    SELECT "username", "userID", "firstName", "lastName"
    FROM "users"
    WHERE  "username" = $1`;
  const params = [username];
  const result = await db.query(sql, params);
  res.json(result.rows);
});

// Login
app.post('/api/pigeon/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const sql = `
      SELECT "userID", "hashedPassword"
      FROM "users"
      WHERE "username"=$1;`;
    const params = [username];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'Invalid Login');
    }
    const { userID, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'Invalid Login');
    }
    const payload = { userID, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

// Signup
app.post('/api/pigeon/signup', async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const sql = `
      INSERT INTO "users" ("firstName", "lastName", "email", "username", "hashedPassword")
      VALUES ($1, $2, $3, $4, $5);`;
    const hashedPassword = await argon2.hash(password);
    const params = [firstName, lastName, email, username, hashedPassword];
    await db.query(sql, params);
    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

// Get all friend requests for a userID
app.get('/api/pigeon/requests/:userID', async (req, res, next) => {
  try {
    const { userID } = req.params;
    const sql = `SELECT "requests"."senderID", "users"."username", "users"."firstName", "users"."lastName"
      FROM "requests"
      JOIN "users" ON "requests"."senderID" = "users"."userID"
      WHERE "receiverID" = $1
      ORDER by "timestamp" ASC;`;
    const params = [userID];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Send a friend request to a userID from a userID
app.post(
  '/api/pigeon/requests/:senderID/:receiverID',
  async (req, res, next) => {
    try {
      const { senderID, receiverID } = req.params;
      const sql = `
        INSERT INTO "requests" ("senderID", "receiverID")
        VALUES ($1, $2);`;
      const params = [senderID, receiverID];
      await db.query(sql, params);
      res.status(201).send();
    } catch (err) {
      next(err);
    }
  }
);
/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

/**
 * Socket Server Event Handlers
 */
io.on('connection', (socket) => {
  console.log('user connected');
  io.to(socket.id).emit('socket-init-request', 'hello');
  // Add socket to client list
  socket.on('socket-init-response', (client) => {
    socketClientDict['' + client.userID] = client.socketID;
    console.log(`hello ${client.userID}`);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Listen for friend request being sent
  socket.on('friend-request-sent', async (request: FriendRequest) => {
    const { senderID, receiverID } = request;
    const sql = `
      INSERT INTO "requests" ("senderID", "receiverID")
      VALUES ($1, $2);`;
    const params = [senderID, receiverID];
    await db.query(sql, params);
    // If receiving user is online, emit "friend-request-received" event to them
    const socketID = socketClientDict['' + receiverID];
    if (socketID !== undefined) {
      io.to('' + socketID).emit('friend-request-received');
    }
  });

  // Listen for Friend Request decision
  socket.on('friend-request-decision', (decision: string) => {
    console.log('friend request decision:', decision);
  });
  // Listen for new messages
  // Update DB
  socket.on('chat-message', async (msg: Message) => {
    const { conversationID, userID, username, messageContent } = msg;
    // Notify the server that message body is received
    console.log(`message from ${username}`);
    let sql = `
    INSERT INTO "messages" ("conversationID", "userID", "messageContent")
    VALUES ($1, $2, $3)`;
    let params = [
      conversationID,
      userID,
      `Message from ${username} ` + messageContent,
    ];
    await db.query(sql, params);

    // Get conversation userID's, If match active SocketClient userID's, emit to them
    sql = `
      SELECT "userID"
      FROM "conversations"
      WHERE "conversationID" = $1`;
    params = [conversationID];
    const result = await db.query(sql, params);
    for (let i = 0; i < result.rows.length; i++) {
      const socketID = socketClientDict['' + result.rows[i].userID];
      if (socketID !== undefined) {
        io.to('' + socketID).emit('message-received', conversationID);
      }
    }
  });
});

server.listen(process.env.PORT, () => {
  process.stdout.write(`\nserver listening on port ${process.env.PORT}\n\n`);
});
