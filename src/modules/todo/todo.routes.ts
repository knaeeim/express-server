import { Router } from "express";
import { todoControllers } from "./todo.controller";

const router = Router(); 

router.get('/', todoControllers.getAllTodos)

router.post('/', todoControllers.createTodo);

router.get('/:id', todoControllers.getSingleTodo);

router.delete('/:id', todoControllers.deleteTodo);


export const todoRouters = router;