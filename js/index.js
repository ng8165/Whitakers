const label = document.querySelector("label[for=word]");
const latin = document.getElementById("latin");
const english = document.getElementById("english");
const input = document.getElementById("word");
const form = document.querySelector("form");
const result = document.querySelector("pre");

latin.addEventListener("click", () => {
    label.textContent = "Enter a Latin word...";
});

english.addEventListener("click", () => {
    label.textContent = "Enter an English word...";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mode = latin.checked ? "latin" : "english";
    const query = input.value;

    fetch(`/api/${mode}/${query}`)
        .then((response) => response.json())
        .then(({status, message}) => {
            if (status === "error") {
                throw new Error(message);
            } else {
                result.style.display = "block";
                result.textContent = message;
            }
        })
        .catch((err) => {
            console.error("Client-side fetch to API failed");
            alert(`ERROR: ${err.message}`);
        });
});

