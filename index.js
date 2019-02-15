const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const filenamify = require("filenamify");
const bodyparser = require("body-parser");

const requestPath = "requests";
const responsePath = "index.html";

app.use(bodyparser.json());
app.set("trust proxy", true);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, responsePath));

    saveRequest(req);
});

app.listen(8080, () => {
    console.log("Listening on port 8080.");
});

function saveRequest(req) {
    if (req.url.includes("favicon.ico")) return;

    let filename = createFilename(req);
    let data = createRequestObject(req);

    fs.writeFile(filename, data, { flag: "w" }, (err) => {
        if (err) console.log(err);
    });
}

function createRequestObject(req) {
    return JSON.stringify({
        url: req.url,
        originalUrl: req.originalUrl,
        baseurl: req.baseUrl,
        protocol: req.protocol,
        accepted: req.accepted,
        ip: req.ip,
        proxyIps: req.ips,
        subdomains: req.subdomains,
        path: req.path,
        hostname: req.hostname,
        fresh: req.fresh,
        stale: req.stale,
        xhr: req.xhr,
        body: req.body,
        headers: req.headers,
        cookies: req.cookies,
        signedCookies: req.signedCookies,
        params: req.params,
        query: req.query
    }, null, 4);
}

function createFilename(req) {
    let prefix = req.url.trim().length > 0 ? req.url : "root";
    let filename = `req-${ prefix }-${ getFormattedDate() }.json`;
    let withPath = path.join(__dirname, requestPath, filenamify(filename));

    return withPath;
}

function getFormattedDate() {
    let date = new Date();

    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    let str = `${ date.getFullYear() }-${ month }-${ day }-${ hour }-${ min }-${ sec }`;

    return str;
}