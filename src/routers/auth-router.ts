import * as express from 'express';

const router = express.Router();

//TODO: implement auth router

router.post('/register', (req, res) => {
  let condition = true;

  if (condition) {
    res.json({ success: true, redirect: '/login' });
  } else {
    res.json({ success: false, messages: [{ type: 'Error', msg: 'Error occured!' }] });
  }
});

export default router;
