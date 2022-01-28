import * as http from "node:http";
import * as url from "node:url";

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get query string as an object
    const queryStringObj = JSON.stringify(parsedUrl.query);

    // Get HTTP method
    const method = req.method.toLowerCase();

    // Get headres
    const headers = req.headers;

    console.log(headers);

    res.end("Hello world");
});

server.listen(3000, () => {
    console.log("Serving listenting on port 3000");
});