const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");

const downloads = require("./downloads");
const filesPath = "downloads";
const requestPath = "requests";
const responsePath = "index.html";

app.use(bodyparser.json());
app.set("trust proxy", true);

for (let url in downloads) {
    let filename = path.join(__dirname, filesPath, downloads[url]);

    app.get(url, (req, res) => {
        res.download(filename);

        saveRequest(req);
    });
}

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
    let filename = `req-${ getFormattedDate() }.json`;
    let withPath = path.join(__dirname, requestPath, filename);

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

    let str = `y${ date.getFullYear() }-mo${ month }-d${ day }-h${ hour }-mi${ min }-s${ sec }`;

    return str;
}