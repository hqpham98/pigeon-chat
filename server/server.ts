/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

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
    origin: 'http://localhost:5173',
  },
});

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

//Get all conversations involving self
app.get('/api/pigeon/conversations/:userID', async (req, res) => {
  const { userID } = req.params;
  const sql = `SELECT "conversationID"
   FROM "conversations"
   WHERE "userID" = $1`;
  const params = [userID];
  const result = await db.query(sql, params);
  res.send(result.rows);
});

app.post('/api/pigeon/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const sql = `
    SELECT "userID", "hashedPassword"
    FROM "users"
    WHERE "username"=$1`;
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

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg) => {
    console.log('message', msg);
  });
});

server.listen(process.env.PORT, () => {
  process.stdout.write(`\n\server listening on port ${process.env.PORT}\n\n`);
});
