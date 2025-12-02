import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.join(process.cwd(), '.env')
})

const app = express()
const port = 3000

// parser
app.use(express.json());

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
})

const initDB = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY, 
            name VARCHAR(100) NOT NULL, 
            email VARCHAR(150) UNIQUE NOT NULL,
            age INT, 
            phone VARCHAR(15), 
            address TEXT, 
            created_at TIMESTAMP DEFAULT NOW(), 
            updated_at TIMESTAMP DEFAULT NOW()
        )`
    )

    await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
                id SERIAL PRIMARY KEY, 
                user_id INT REFERENCES users(id) ON DELETE CASCADE, 
                title VARCHAR(200) NOT NULL, 
                descripiton TEXT, 
                completed BOOLEAN DEFAULT FALSE, 
                due_date DATE, 
                created_at TIMESTAMP DEFAULT NOW(), 
                updated_at TIMESTAMP DEFAULT NOW()  
            )`
    )
}

initDB();


app.get('/', (req: Request, res: Response) => {
    res.send('Hello Next Level Developer')
})

// users CURD
app.post('/users', async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        )
        res.status(201).json({
            success: true,
            message: 'Data received successfully',
            data: result.rows[0]
        })
    } catch (error: any) {
        console.error('Error inserting user:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
})

// getting all users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users')
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
                message : 'User deleted successfully',
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
            data : result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            details: error
        })
    }
})

app.post('/todos', async(req: Request, res: Response) => {
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
            success : false, 
            message : error.message,
            details : error
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
