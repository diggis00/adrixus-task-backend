import express from 'express';
import { login, register, getUser } from '../controllers/user.js';

let router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/list', getUser);

export default router;
