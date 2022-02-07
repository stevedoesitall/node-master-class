import * as fs from "node:fs";
import * as http from "node:http";
import * as https from "node:https";
import * as url from "node:url";
import * as string_decoder from "node:string_decoder";
import handlers from "./lib/handlers";
import helpers from "./lib/helpers";
import envToExport from "./config";

const StringDecoder = string_decoder.StringDecoder;

const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(envToExport.httpPort, () => {
    console.log("Serving listenting on port", envToExport.httpPort);
});

const httpsServerOptions = {
    key: fs.readFileSync("./https/key.pem"),
    cert: fs.readFileSync("./https/cert.pem")
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(envToExport.httpsPort, () => {
    console.log("Serving listenting on port", envToExport.httpsPort);
});

const unifiedServer = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get query string as an object
    const queryStringObj = JSON.stringify(parsedUrl.query);

    // Get HTTP method
    const method = req.method.toLowerCase();

    // Get headres
    const headers = req.headers;

    const decoder = new StringDecoder("utf-8");
    
    let buffer = "";

    req.on("data", (data) => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {
        buffer += decoder.end();
        const chosenHandler = typeof(router[trimmedPath]) ? router[trimmedPath] : handlers.notFound;

        const data = {
            trimmedPath,
            queryStringObj,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        }

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof(statusCode) === "number" ? statusCode : 200;
            payload = typeof(payload) === "object" ? payload : {};

            const payloadStr = JSON.stringify(payload);
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadStr);

            console.log("Res is", statusCode, payloadStr);
        });
    });
};

const router = {
    "ping": handlers.ping
};