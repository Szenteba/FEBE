import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { userController } from './controllers/user.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Frontend')));

app.post('/api/getuser', userController.getUser);
app.post('/api/senduser', userController.sendUser);
app.post('/api/login', userController.login);
app.post('/api/logout', userController.logout);
app.get('/api/check-session', userController.checkSession);

app.listen(3000, () => {
    console.log('Backend server is running on http://localhost:3000');
});
