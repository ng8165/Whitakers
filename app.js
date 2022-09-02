const express = require("express");
const https = require("https");
const cors = require("cors");

const app = express();
app.use(cors({origin: "http://localhost:8888"}));

app.get("/", (req, res) => {
    https.get(`https://archives.nd.edu/cgi-bin/wordz.pl?${req.query.mode === "latin" ? "keyword" : "english"}=${req.query.query}`, (httpsRes) => {
        httpsRes.on("data", (data) => {
            const html = data.toString();
            const def = html.substring(html.indexOf("<pre>")+5, html.lastIndexOf("</pre>")).trim();
            res.json({result: def});
        });
    });
});

app.listen(3000);