import Head from "next/head";
import { useEffect, useState } from "react";
import { Form, FloatingLabel, Button, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

export default function Home() {
    const [ isLatin, setMode ] = useState(true);
    const [ text, setText ] = useState("");
    const [ def, setDef ] = useState("");
    const router = useRouter();

    function handleSubmit(e) {
        e.preventDefault();
        
        fetch(`/api/${isLatin ? "latin" : "english"}/${text}`)
            .then((res) => res.json())
            .then(({status, message}) => {
                setText("");
                
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

    const [ redirect, setRedirect ] = useState(false);

    useEffect(() => {
        let redirect = localStorage.getItem("redirect");

        if (redirect == null) {
            redirect = confirm("This website is now deprecated and will not work. Do you want to be redirected to latin-words.com in the future?").toString();
            localStorage.setItem("redirect", redirect);
        }

        if (redirect === "true") {
            setRedirect(true);
            router.replace("https://latin-words.com");
        }
    }, []);

    function LoadingOverlay() {
        return (
            <div className="position-fixed" style={{ background: "rgba(0, 0, 0, 0.3)", inset: 0, zIndex: 10 }}>
                <div className="position-absolute top-50 start-50 translate-middle">
                    <Spinner animation="border" style={{ width: "5rem", height: "5rem" }} />
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Nelson&apos;s Words</title>
            </Head>

            {redirect && <LoadingOverlay />}

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
