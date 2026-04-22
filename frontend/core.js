document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("submit-button");
    const inputField = document.getElementById("command-field");
    const resultBlock = document.getElementById("result-block");
    const fields = [
        "article_id",
        "full_name",
        "sex",
        "birth_year",
        "city",
        "state",
        "country",
        "continent",
        "latitude",
        "longitude",
        "occupation",
        "industry",
        "domain",
        "article_languages",
        "page_views",
        "average_views",
        "historical_popularity_index"
    ];

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

function collectData() {
    const data = {};

    fields.forEach(field => {
        const el = document.getElementById(field);
        data[field] = el ? el.value : null;
    });

    return data;
}

function collectDataEdit() {
    const data = {};

    fields.forEach(field => {
        const el = document.getElementById(field+"_e");
        data[field] = el ? el.value : null;
    });

    return data;
}

function fillForm(data) {
    console.log(data);
    Object.keys(data).forEach(key => {
        const input = document.getElementById(key+"_e");
        if (input) {
            input.value = data[key] ?? "";
        }
    });
}

async function getAll() {
    response = await fetch("http://localhost:3000/objects");
    data = await response.json();
    renderTable(data);
}
function openFilterModal() {
    document.getElementById("filterModal").style.display = "flex";
}
function openCreateModal() {
    document.getElementById("createModal").style.display = "flex";
}
async function openEditModal() {
    document.getElementById("editModal").style.display = "flex";
    response = await fetch("http://localhost:3000/objects/ids");
    data = await response.json();
    const select = document.getElementById("article_id_edit");
    select.innerHTML = '<option>Choose record</option>';

    data.forEach(item => {
        const option = document.createElement("option");

        option.value = item.article_id;
        option.textContent = item.article_id;

        select.appendChild(option);
    });
}
async function applyFilter() {
    const query = document.getElementById("filterName").value;
    const param = document.getElementById("filterParam").value;

    const response = await fetch(
        `http://localhost:3000/object?param=${param}&query=${query}`
    );

    const data = await response.json();
    renderTable(data);

    closeModal("filterModal");
}
async function addObject() {
    const data = collectData();

    response = await fetch("http://localhost:3000/object", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    closeModal("createModal");
}
async function editObject() {
    const data = collectDataEdit();

    const id = document.getElementById("article_id_edit").value;
        if (!id){
            fillForm({});
            return;
        }

    response = await fetch(`http://localhost:3000/object/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    closeModal("editModal");
}
async function getStats() {
    response = await fetch("http://localhost:3000/objects/stats");
    data = await response.json();
    renderTable(data);
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

    async function handleCommand() {
        const input = inputField.value.trim();

        if (!input) return;

        try {
            let response;
            let data;
            //GET /objects
            if (input === "GET /objects") {
                
            }
            //GET /objects?name=
            else if (input.startsWith("GET /object?name=")) {
                // const query = input.split("=")[1];
                const query = "Female";
                const param = "sex";

                response = await fetch(
                    `http://localhost:3000/object?param=${param}&query=${query}`
                );
                
                data = await response.json();
                console.log(data);
                renderTable(data);
            }
            //POST /object
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
            
            else {
                resultBlock.innerHTML = `<p style="color:red">Invalid command</p>`;
                return;
            }

        } catch (err) {
            resultBlock.innerHTML = `<p style="color:red">Server error</p>`;
        }

        inputField.value = "";
    }


    document.getElementById("btn-get").addEventListener("click", getAll);
    document.getElementById("btn-filter").addEventListener("click", openFilterModal);
    document.getElementById("btn-add").addEventListener("click", openCreateModal);
    document.getElementById("btn-edit").addEventListener("click", openEditModal);
    document.getElementById("btn-stats").addEventListener("click", getStats);

    document.getElementById("btn-save").addEventListener("click", applyFilter);
    document.getElementById("btn-filter-close").addEventListener("click", () => {closeModal("filterModal");});

    document.getElementById("btn-modal-add").addEventListener("click", addObject);
    document.getElementById("btn-add-close").addEventListener("click", () => {closeModal("createModal");});

    document.getElementById("btn-modal-edit").addEventListener("click", editObject);
    document.getElementById("btn-edit-close").addEventListener("click", () => {closeModal("editModal");});

    document.getElementById("article_id_edit").addEventListener("change", async (e) => {
        const id = e.target.value;
        if (!id){
            fillForm({});
            return;
        }
        const res = await fetch(`http://localhost:3000/object/${id}`);
        const data = await res.json();
        fillForm(data);
    });

    // inputField.addEventListener("keydown", (e) => {
    //     if (e.key === "Enter") {
    //         handleCommand();
    //     }
    // });
});