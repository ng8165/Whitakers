const label = document.querySelector("label[for=word]");
const latin = document.getElementById("latin");
const english = document.getElementById("english");
const input = document.getElementById("word");
const form = document.querySelector("form");
const result = document.querySelector("pre");

latin.addEventListener("click", (e) => {
    label.textContent = "Enter a Latin word...";
});

english.addEventListener("click", (e) => {
    label.textContent = "Enter an English word...";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mode = latin.checked ? "latin" : "english";
    const query = input.value;

    fetch(`http://localhost:3000/?mode=${mode}&query=${query}`)
        .then((response) => response.json())
        .then((data) => {
            result.style.display = "block";
            result.textContent = data.result;
            if (result.textContent.length === 0)
                result.textContent = "ERROR";
        });
});

