import fs from "fs";
import http from "http";
import https from "https";

import app from "./src/app.js";
import configs from "./src/utils/configs/index.js";
import socketServer from "./src/wss/socket.js";


async function runServer() {
    const PORT = configs.port || 3200;

    let server;
    if (configs.enableSSL) {
        const key = fs.readFileSync('./cert/cert.key');
        const cert = fs.readFileSync('./cert/cert.crt');
        server = https.createServer({ key, cert }, app);
    } else {
        server = http.createServer(app);
    }

    socketServer(server);
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`, true);
        console.log(`Access it from ${configs.enableSSL ? 'https' : 'http'}://localhost:${PORT}`, true);
    });
}

runServer();