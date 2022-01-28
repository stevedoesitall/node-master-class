import * as http from "node:http";
import * as url from "node:url";
import * as string_decoder from "node:string_decoder";

const StringDecoder = string_decoder.StringDecoder;

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

    const decoder = new StringDecoder("utf-8");
    
    let buffer = "";

    req.on("data", (data) => {
        buffer += decoder.write(data);
    });

    req.on("end", () => {
        buffer += decoder.end();
        res.end("Hello world");
        console.log(buffer);
    });

});

server.listen(3000, () => {
    console.log("Serving listenting on port 3000");
});