import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';

import _userConnections from "./clients.js";
import logger from "../utils/helpers/logger.js";
import configs from "../utils/configs/index.js";


function socketServer(server) {
    try {
        const wss = new WebSocketServer({ noServer: true });
        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        wss.on('connection', (ws, request) => {
            const userId = uuidToShortCode(new URL(request.url, configs.baseUrl).searchParams.get('userId') || uuidv4());
            const username = new URL(request.url, configs.baseUrl).searchParams.get('username') || userId;
            const userGroup = new URL(request.url, configs.baseUrl).searchParams.get('userGroup') || "default";
            const userType = new URL(request.url, configs.baseUrl).searchParams.get('userType') || "visitor";
            const connectionId = uuidv4();

            logger(`User connected ${userId}: ${connectionId}`);

            const wsData = {
                id: connectionId,
                ws: ws,
                createdAt: currentDateTime()
            }


            if (_userConnections[userId]) {
                _userConnections[userId].status = "Online";
                _userConnections[userId].data.push(wsData);
                _userConnections[userId].updatedAt = currentDateTime();
            } else {
                _userConnections[userId] = {
                    username,
                    userGroup,
                    userType,
                    status: "Online",
                    data: [wsData],
                    createdAt: currentDateTime(),
                }
            }
            let userinfo = {
                userId,
                username,
                userGroup,
                userType,
                connectionId
            }

            const payload = {
                type: "loginfo",
                data: userinfo
            }

            ws.send(JSON.stringify(payload));

            ws.on('message', (message) => {
                ws.send(`message sent successfully`);
                const data = JSON.parse(message);
                if (data.type === "message") {
                    onSocketMessage(data, userId);
                }
            });

            ws.on('close', (data) => {
                logger(`User disconnected ${userId}: ${connectionId}`);
                _userConnections[userId].data = _userConnections[userId].data.filter((item) => item.id !== connectionId);
                if (_userConnections[userId].data.length === 0) {
                    _userConnections[userId].status = "Offline";
                    _userConnections[userId].updatedAt = currentDateTime();
                }
            });
        });


    } catch (error) {

    }
}

function onSocketMessage(data, from) {
    const { to } = data;
    if (Array.isArray(to)) {
        to.forEach((user) => {
            sendMessageToUser(user, data, from);
        });
    } else if (typeof to === 'string' && _userConnections[to]) {
        sendMessageToUser(to, data, from);
    }
}

function sendMessageToUser(userId, data, from) {
    _userConnections[userId]?.data.forEach((item) => {
        item.ws.send(JSON.stringify({ from, to: userId, payload: data.payload }));
    })
}

function uuidToShortCode(id) {
    const uuidWithoutHyphens = id.replace(/-/g, '');
    const base36Code = parseInt(uuidWithoutHyphens.substring(0, 8), 16).toString(36);
    const paddedCode = base36Code.padStart(8, '0');

    return paddedCode;
}

function currentDateTime() {
    return new Date().toISOString();
}

export default socketServer;