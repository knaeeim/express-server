import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const result = await userServices.createUser(name, email)
        res.status(201).json({
            success: true,
            message: 'Data received successfully',
            data: result.rows[0]
        })
    } catch (error: any) {
        console.error('Error inserting user:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers();
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

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userServices.getSingleUser(id as string);
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
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const { id } = req.params;
        const result = await userServices.updateUser(id as string, name, email);

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
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userServices.deleteUser(id as string);
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
}

export const userControllers = {
    createUser, 
    getUsers,
    getSingleUser, 
    updateUser,
    deleteUser
} 