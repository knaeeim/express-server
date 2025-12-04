import express, { Request, Response } from 'express'
import config from './config';
import initDB, { pool } from './config/db';
import { userRouters } from './modules/user/user.routes';
import { todoRouters } from './modules/todo/todo.routes';
import { authRouters } from './modules/auth/auth.routes';

const app = express()

// parser
app.use(express.json());

// initialize database
initDB();

// users CURD
app.use('/users', userRouters);

app.use('/todos', todoRouters);

app.use('/auth', authRouters);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Dhuro MotherChod Route Check kor"
    })
})

export default app;