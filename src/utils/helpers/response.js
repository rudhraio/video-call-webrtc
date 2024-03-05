import logger from './logger.js';


function successResponse(
    res,
    message = "ok",
    data = [],
    redirect,
    from = "NA"
) {
    logger(`[response]: 200 \n[message]: ${message} \n[data]: ${JSON.stringify(data)} \n[function]: ${from} \n`, false);
    let responsePayload = {
        status: 200,
        message: message,
        data: data
    }
    if (redirect) {
        responsePayload["redirect"] = redirect;
    }
    return res.status(200).json(responsePayload);
}

function createResponse(
    res,
    message = "created successfully",
    data = [],
    redirect,
    from = "NA"
) {
    logger(`[response]: 201 \n[message]: ${message} \n[data]: ${JSON.stringify(data)} \n[function]: ${from} \n`, false);
    let responsePayload = {
        status: 201,
        message: message,
        data: data
    }
    if (redirect) {
        responsePayload["redirect"] = redirect;
    }
    return res.status(201).json(responsePayload)
}


function invalidResponse(
    res,
    message = "Invalid data send",
    data = [],
    from = "NA"
) {
    logger(`[response]: 400 \n[message]: ${message} \n[data]: ${JSON.stringify(data)} \n[function]: ${from} \n`, false);

    return res.status(400).json({
        status: 400,
        message: message,
        data: data
    })
}


function notFoundResponse(
    res,
    message = "No data found",
    data = [],
    from = "NA"
) {
    logger(`[response]: 404 \n[message]: ${message} \n[data]: ${JSON.stringify(data)} \n[function]: ${from} \n`, false);

    return res.status(404).json({
        status: 404,
        message: message,
        data: data
    })
}

function unauthorizedResponse(
    res,
    message = "user unauthorized",
    data = [],
    from = "NA"
) {
    logger(`[response]: 403 \n[message]: ${message} \n[data]: ${JSON.stringify(data)} \n[function]: ${from} \n`, false);

    return res.status(403).json({
        status: 403,
        message: message,
        data: data
    })
}

function serverErrorResponse(
    res,
    message = "Internal server error",
    data = [],
    from = "NA"
) {
    logger(`[response]: 500 \n[message]: ${message} \n[data]: ${JSON.stringify(data)} \n[function]: ${from} \n`, false);

    return res.status(500).json({
        status: 500,
        message: message,
        data: data
    })
}

export {
    invalidResponse,
    notFoundResponse,
    unauthorizedResponse,
    serverErrorResponse,
    successResponse,
    createResponse
}