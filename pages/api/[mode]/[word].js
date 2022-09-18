import snakeCase from "lodash.snakecase";

export default function handler(req, res) {
    let { mode, word } = req.query;

    if (mode === "latin") {
        mode = "keyword";
    } else if (mode !== "english") {
        console.error("Given mode was invalid");
        res.status(400).json({ status: "error", message: "mode is invalid" });
        return;
    }
    
    const url = `https://archives.nd.edu/cgi-bin/wordz.pl?${mode}=${snakeCase(word)}`;

    return fetch(url)
        .then((res) => {
            if (!res.ok) {
                console.error("HTTP response from Notre Dame Whitaker's failed");
                throw new Error("could not fetch data");
            }

            return res.text();
        })
        .then((html) => {
            const def = html.substring(html.indexOf("<pre>")+5, html.lastIndexOf("</pre>")).trim();

            if (def.length === 0) {
                console.error("Notre Dame Whitaker's returned nothing");
                res.status(404).json({ status: "error", message: "invalid word" });
            } else {
                res.status(200).json({ status: "ok", message: def });
            }
        })
        .catch((err) => {
            console.error("Fetch request to Notre Dame Whitaker's failed")
            res.status(500).json({ status: "error", message: err.message });
        });
}
