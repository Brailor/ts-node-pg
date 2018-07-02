import * as express from 'express';

const router = express.Router();

/**
 * Handle the HTTP request for the main page
 */
router.get('/', async (req, res, next) => {
    res.json({ hello: 'world' });
});

// setup routers here
//router.use('/example', exampleRouter)

export default router;
