import express from "express";

import routes from "./routes/index.js";
import requestLogger from "./utils/middlewares/request-logger.js";
import { notFoundResponse } from "./utils/helpers/response.js";

const app = express();

app.get("/ping", (req, res) => {
    return res.status(200).json({ status: 200, message: "ok" })
});

app.use("/api", requestLogger, routes);

app.all('*', requestLogger, (_, res) => {
    return notFoundResponse(res, "No matching URL found");
});


export default app;