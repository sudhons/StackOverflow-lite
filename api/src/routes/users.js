import express from 'express';

import User from '../controllers/usersController';
import Validator from '../validators/validator';

const router = express.Router();

router.post('/signup', Validator.validateNewUser, User.signup);
router.post('/login', Validator.validateUser, User.login);

export default router;
