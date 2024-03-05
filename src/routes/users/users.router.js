import express from "express";
import userGet from "./users.get.js";

const usersRouter = express.Router();

usersRouter.use("/get", userGet);

export default usersRouter;