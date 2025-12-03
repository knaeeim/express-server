import express, { Request, Response } from 'express'
import config from './config';
import initDB, { pool } from './config/db';
import { userRouters } from './modules/user/user.routes';
import { userControllers } from './modules/user/user.controller';

const app = express()
const port = config.port

// parser
app.use(express.json());

// initialize database
initDB();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello Next Level Developer')
})

// users CURD
app.use('/users', userRouters);
// app.post('/users', async (req: Request, res: Response) => {
//     const { name, email } = req.body;
//     try {
//         const result = await pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
//             [name, email]
//         )
//         res.status(201).json({
//             success: true,
//             message: 'Data received successfully',
//             data: result.rows[0]
//         })
//     } catch (error: any) {
//         console.error('Error inserting user:', error.message);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// })

// getting all users

app.use('/users', userRouters)
// app.get('/users', async (req: Request, res: Response) => {
//     try {
//         const result = await pool.query('SELECT * FROM users')
//         res.status(200).json({
//             success: true,
//             data: result.rows
//         })
//     } catch (error: any) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//             details: error
//         })
//     }
// })

// getting single user

app.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        else {
            res.status(200).json({
                success: true,
                data: result.rows[0]
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})

// Update single user
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const { id } = req.params;
        const result = await pool.query('UPDATE users SET name=$1, email=$2 WHERE id = $3 RETURNING *', [name, email, id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        else {
            res.status(200).json({
                success: true,
                data: result.rows[0]
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})

// Delete single user
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        else {
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
                data: null
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})


app.get("/todos", async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM todos');
        res.status(200).json({
            success: true,
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})

// get single todo
app.get('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM todos WHERE id =$1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Todo not found'
            })
        }
        else {
            res.status(200).json({
                success: true,
                data: result.rows[0]
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})

app.delete('/todos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        if(result.rowCount === 0){
            res.status(404).json({
                success : false, 
                message : "You have attempted to delete a todo that does not exist"
            })
        }
        else{
            res.status(200).json({
                success : true, 
                message : "Todo deleted successfully", 
                data : null
            })
        }
    } catch (error : any) {
        res.status(500).json({
            success : false, 
            message: error.message, 
            details : error
        })
    }
})

app.post('/todos', async (req: Request, res: Response) => {
    try {
        const { user_id, title, descripiton } = req.body;
        const result = await pool.query('INSERT INTO todos (user_id, title, descripiton) VALUES($1, $2, $3) RETURNING *', [user_id, title, descripiton])
        res.status(201).json({
            success: true,
            message: 'Data received successfully',
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Dhuro MotherChod Route Check kor"
    })
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
