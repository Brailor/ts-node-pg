import * as express from 'express';
import { check, validationResult } from 'express-validator/check';
import { basicCheck } from '../middlewares/validatorMW';

const router = express.Router();

//TODO: implement auth router

router.post('/register', basicCheck(['username', 'email', 'role', 'password']), (req, res) => {
  //TODO: Write generic middleware for this error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let condition = true;

  //TODO: check if the user is already registered with the given credentials
  // (eg. we get a user from the DB   )
  if (condition) {
    return res.json({ success: true, redirect: '/login' });
  } else {
    return res.json({ success: false, messages: [{ type: 'Error', msg: 'Error occured!' }] });
  }
});

export default router;
