import { Request, Response } from "express";
import { todoServices } from "./todo.service";


const getAllTodos = async (req: Request, res: Response) => {
    try {
        const result = await todoServices.getAllTodos();
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
}

const getSingleTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await todoServices.getSingleTodo(id as string);
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
}

const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await todoServices.deleteTodo(id as string);
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
}

const createTodo = async (req: Request, res: Response) => {
    try {
        const { user_id, title, descripiton } = req.body;
        const result = await todoServices.createTodo(user_id, title, descripiton);
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
}


export const todoControllers = {
    getAllTodos,
    getSingleTodo,
    deleteTodo,
    createTodo
}