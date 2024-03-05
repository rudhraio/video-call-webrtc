import express from "express";

import { getAllUsersInfo } from "../../wss/clients.js";
import { serverErrorResponse, successResponse } from "../../utils/helpers/response.js";
import logger from "../../utils/helpers/logger.js";

const userGet = express.Router();

userGet.get("/", (req, res) => {
    try {
        const user = getAllUsersInfo();
        return successResponse(res, "users list", user);
    } catch (error) {
        logger(`[ERR]: ${error}`, true);
        return serverErrorResponse(res);
    }
});

export default userGet;