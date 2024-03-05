import express from 'express';
import usersRouter from './users/users.router.js';

const routes = express.Router();

routes.use("/users", usersRouter)

export default routes;