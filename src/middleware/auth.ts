import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config";


const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log(token);
            if (!token) {
                return res.status(500).json({
                    success: false,
                    message: "No Token Provided"
                })
            }

            const decode = jwt.verify(token as string, config.secret_key as string) as JwtPayload;
            console.log({ decoded: decode });
            req.user = decode;
            next();

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
                details: error
            })
        }
    }
}

export default auth;