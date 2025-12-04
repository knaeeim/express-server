import { Router } from "express";
import { userControllers } from "../user/user.controller";
import { todoControllers } from "./todo.controller";

const router = Router(); 

router.get('/', todoControllers.getAllTodos)

router.get('/:id', todoControllers.getSingleTodo);

router.delete('/:id', todoControllers.deleteTodo);



export const todoRouters = router;