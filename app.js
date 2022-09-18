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
    if (req.params.mode === "latin") {
        req.params.mode = "keyword";
    } else if (req.params.mode !== "english") {
        console.log("Given mode was invalid");
        res.status(400).json({ status: "error", message: "mode is invalid" });
        return;
    }

    const url = `https://archives.nd.edu/cgi-bin/wordz.pl?${req.params.mode}=${snakeCase(req.params.query)}`;

    const httpsReq = https.get(url, (httpsRes) => {
        if (httpsRes.statusCode < 200 || httpsRes.statusCode > 299) {
            console.error("Fetch request to Notre Dame Whitaker's failed")
            res.status(500).json({ status: "error", message: "could not fetch data" });
            return;
        }
        
        httpsRes.on("data", (data) => {
            const html = data.toString();
            const def = html.substring(html.indexOf("<pre>")+5, html.lastIndexOf("</pre>")).trim();

            if (def.length === 0) {
                console.error("Notre Dame Whitaker's returned nothing");
                res.status(404).json({ status: "error", message: "invalid word" });
            } else {
                res.status(200).json({ status: "ok", message: def });
            }
        });
    });

    httpsReq.on("error", (err) => {
        console.error("Fetch request to Notre Dame Whitaker's failed")
        res.status(500).json({ status: "error", message: err.message });
    });

    httpsReq.end();
});

app.listen(process.env.PORT || 3000);