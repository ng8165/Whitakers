import Head from "next/head";
import { useState } from "react";
import { Form, FloatingLabel, Button } from "react-bootstrap";

export default function Home() {
    const [ isLatin, setMode ] = useState(true);
    const [ text, setText ] = useState("");
    const [ def, setDef ] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        
        fetch(`/api/${isLatin ? "latin" : "english"}/${text}`)
            .then((res) => res.json())
            .then(({status, message}) => {
                if (status === "error") {
                    throw new Error(message);
                } else {
                    setDef(message);
                }
            })
            .catch((err) => {
                console.error("Client-side fetch to API failed");
                alert(`ERROR: ${err.message}`);
            });
    }

    return (
        <>
            <Head>
                <title>Nelson&apos;s Words</title>
            </Head>

            <h1 className="mb-0">Nelson&apos;s Words</h1>
            <em>aka Whitaker&apos;s Words</em>

            <Form className="mt-3" onSubmit={handleSubmit}>
                <Form.Check type="radio" id="latin-button">
                    <Form.Check.Input type="radio" name="mode" checked={isLatin} onChange={() => setMode(true)} />
                    <Form.Check.Label>Latin to English</Form.Check.Label>
                </Form.Check>
                
                <Form.Check type="radio" id="english-button">
                    <Form.Check.Input type="radio" name="mode" checked={!isLatin} onChange={() => setMode(false)} />
                    <Form.Check.Label>English to Latin</Form.Check.Label>
                </Form.Check>

                <FloatingLabel className="my-3" label={isLatin ? "Enter a Latin word..." : "Enter an English word..."}>
                    <Form.Control type="text" placeholder=" " value={text} required onChange={(e) => setText(e.target.value)} />
                </FloatingLabel>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>

            <pre className={`m-3 p-3 ${def.length === 0 && "d-none"}`}>{def}</pre>
        </>
    );
}
