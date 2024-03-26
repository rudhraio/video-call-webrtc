import express from "express";
import path from 'path';


import routes from "./routes/index.js";
import requestLogger from "./utils/middlewares/request-logger.js";
import { notFoundResponse } from "./utils/helpers/response.js";

const app = express();

app.get("/ping", (req, res) => {
    return res.status(200).json({ status: 200, message: "ok" })
});

app.use("/api", requestLogger, routes);


// Set 'views' directory for any views
const viewsPath = new URL('views', import.meta.url).pathname;
app.set('views', path.join(viewsPath));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'src/public')));

// Route for the landing page
app.get('/', (req, res) => {
    res.render('index'); // Renders the 'index.ejs' file in the 'views' directory
});

app.all('*', requestLogger, (_, res) => {
    return notFoundResponse(res, "No matching URL found");
});


export default app;