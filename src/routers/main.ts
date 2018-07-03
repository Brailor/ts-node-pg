import * as express from 'express';
import { join } from 'path';

import * as authRouter from './auth-router';

const router = express.Router();

/**
 * Handle the HTTP request for the main page
 */
router.get('/', async (req, res, next) => {
  res.json({ hello: 'world' });
});

router.get('/login', (req, res) => {
  res.sendFile(join(__dirname, '../public', 'login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(join(__dirname, '../public', 'register.html'));
});

// setup routers here
router.use('/auth', authRouter);

export default router;
