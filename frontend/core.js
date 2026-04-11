document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("submit-button");
    const inputField = document.getElementById("command-field");
    const resultBlock = document.getElementById("result-block");

    function renderTable(data) {
        let html = `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Country</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.score}</td>
                    <td>${item.country}</td>
                    <td>${item.year}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        resultBlock.innerHTML = html;
    }
    async function handleCommand() {
        const input = inputField.value.trim();

        if (!input) return;

        try {
            let response;
            let data;
            if (input === "GET /objects") {
                response = await fetch("http://localhost:3000/objects");
                data = await response.json();
                renderTable(data);
            }
            else if (input.startsWith("GET /object?name=")) {
                const name = input.split("=")[1];

                response = await fetch(
                    `http://localhost:3000/object?name=${name}`
                );

                data = await response.json();
                renderTable(data);
            }
            else if (input === "POST /object") {
                response = await fetch("http://localhost:3000/object", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: "New Person",
                        score: 50,
                        country: "Unknown",
                        year: 2000
                    })
                });

                data = await response.json();
                resultBlock.innerText = JSON.stringify(data, null, 2);
            }
            else if (input === "PUT /object") {
                response = await fetch("http://localhost:3000/object/1", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        score: 99
                    })
                });

                data = await response.json();
                resultBlock.innerText = JSON.stringify(data, null, 2);
            }
            else if (input === "GET /stats") {
                response = await fetch("http://localhost:3000/stats");
                data = await response.json();

                resultBlock.innerHTML = `
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            }
            else {
                resultBlock.innerHTML = `<p style="color:red">Invalid command</p>`;
                return;
            }

        } catch (err) {
            resultBlock.innerHTML = `<p style="color:red">Server error</p>`;
        }

        inputField.value = "";
    }

    button.addEventListener("click", handleCommand);
    inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleCommand();
        }
    });
});