document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("submit-button");
    const inputField = document.getElementById("command-field");
    const resultBlock = document.getElementById("result-block");

const pretty = (str) =>
    str.replaceAll("_", " ")
       .replace(/\b\w/g, c => c.toUpperCase());

//moja ekstra funkcja na automatyczne generowanie tabeli w zaleznosci od rozmiaru
function renderTable(data) {
    if (!data || data.length === 0) {
        resultBlock.innerHTML = "<p>No data</p>";
        return;
    }

    const columns = Object.keys(data[0]);

    let html = `
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
    `;

    columns.forEach(col => {
        html += `<th>${pretty(col)}</th>`;
    });

    html += `
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach(item => {
        html += "<tr>";

        columns.forEach(col => {
            const value = item[col];

            html += `<td>${value ?? "-"}</td>`;
        });

        html += "</tr>";
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
            //GET /objects
            //TODO podpiąć żeby pokazywało z database, a poza tym działa
            if (input === "GET /objects") {
                response = await fetch("http://localhost:3000/objects");
                data = await response.json();
                renderTable(data);
            }
            //GET /objects?name=
            else if (input.startsWith("GET /object?name=")) {
                const name = input.split("=")[1];

                response = await fetch(
                    `http://localhost:3000/object?name=${name}`
                );

                data = await response.json();
                renderTable(data);
            }
            //POST /object
            //narazie dodaje przykladowy rekord
            //TODO zmienic zeby dodawalo wpisany przez uzytkownika
            else if (input === "POST /object") {
                response = await fetch("http://localhost:3000/object", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        article_id: 3, 
                        full_name: "Bruce Lee", 
                        sex: "Male", 
                        birth_year: 1999, 
                        city: "Kij wi", 
                        state: "LA", 
                        country: "China", 
                        continent: "Asia", 
                        latitude: 189, 
                        longitude: 13.5, 
                        occupation: "Actor", 
                        industry: "Fighting", 
                        domain: "Dragon", 
                        article_languages: 6543, 
                        page_views: 52543634, 
                        average_views: 523452, 
                        historical_popularity_index: 50.0
                    })
                });

                data = await response.json();
                resultBlock.innerText = JSON.stringify(data, null, 2);
            }
            //PUT /object
            //narazie zmienia przykladowy rekord na przykładowy
            //TODO zrobic zeby zmienialo podany rekord i żeby ogólnie działało
            else if (input === "PUT /object") {
                response = await fetch("http://localhost:3000/object/1", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sex: "Female",
                    })
                });

                data = await response.json();
                resultBlock.innerText = JSON.stringify(data, null, 2);
            }
            //TODO ten na 5.0
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