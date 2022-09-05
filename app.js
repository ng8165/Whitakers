const express = require("express");
const https = require("https");
const cors = require("cors");
const snakeCase = require("lodash.snakecase");

const app = express();
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.use(cors({origin: ["https://whitakers.herokuapp.com", "https://latinresources.netlify.app", "http://localhost:3000"]}));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/api/:mode/:query", (req, res) => {
    https.get(`https://archives.nd.edu/cgi-bin/wordz.pl?${req.params.mode === "latin" ? "keyword" : "english"}=${snakeCase(req.params.query)}`, (httpsRes) => {
        httpsRes.on("data", (data) => {
            const html = data.toString();
            const def = html.substring(html.indexOf("<pre>")+5, html.lastIndexOf("</pre>")).trim();
            res.json({result: def});
        });
    });
});

app.listen(process.env.PORT || 3000);