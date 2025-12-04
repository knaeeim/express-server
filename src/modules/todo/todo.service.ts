import { pool } from "../../config/db";

const getAllTodos = async() => {
    const result = await pool.query('SELECT * FROM todos');
    return result;
}

const getSingleTodo = async(id: string) => {
    const result = await pool.query('SELECT * FROM todos WHERE id =$1', [id]);
    return result;
}

const deleteTodo = async(id: string) => {
    const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    return result;
}

const createTodo = async(user_id: string, title: string, descripiton: string) => {
    const result = await pool.query('INSERT INTO todos (user_id, title, descripiton) VALUES($1, $2, $3) RETURNING *', [user_id, title, descripiton]); 
    return result;
}


export const todoServices = {
    getAllTodos,
    getSingleTodo, 
    deleteTodo,
    createTodo
}