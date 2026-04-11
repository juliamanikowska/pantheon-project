const button = document.getElementById("submit-button");

button.addEventListener("click", async () => {
    const input = document.getElementById("command-field").value;

    const response = await fetch("http://localhost:3000/command", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ command: input })
    });

    const data = await response.json();

    document.getElementById("result-block").innerText =
        JSON.stringify(data, null, 2);
});