import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";


const router = Router(); 

router.post('/', userControllers.createUser);

router.get('/', userControllers.getUsers);

router.get('/:id', userControllers.getSingleUser);

export const userRouters = router; 