import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authServices.loginUser(email, password);
        res.status(201).json({
            success: true,
            message: 'User logged in successfully',
            data: result
        })
    } catch (error: any) {
        console.error('Error inserting user:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const authControllers = {
    loginUser,
}