import * as express from 'express';

import authRouter from './auth-router';

const router = express.Router();

/**
 * Handle the HTTP request for the main page
 */
router.get('/', async (req, res, next) => {
  res.json({ hello: 'world' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// setup routers here
router.use('/auth', authRouter);

export default router;
