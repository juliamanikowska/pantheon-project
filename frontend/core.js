import { addr } from './config.js';

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
    Object.keys(data).forEach(key => {
        const input = document.getElementById(key+"_e");
        if (input) {
            input.value = data[key] ?? "";
        }
    });
}

async function getAll() {
    const response = await fetch(`${addr}objects`);
    const data = await response.json();
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
    const response = await fetch(`${addr}objects/ids`);
    const data = await response.json();
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
        `${addr}object?param=${param}&query=${query}`
    );

    const data = await response.json();
    renderTable(data);

    closeModal("filterModal");
}
async function addObject() {
    const data = collectData();

    const response = await fetch(`${addr}object`, {
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

    const response = await fetch(`${addr}object/${id}`, {
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
    const response = await fetch(`${addr}objects/stats`);
    const data = await response.json();
    renderTable(data);
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
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
        const res = await fetch(`${addr}object/${id}`);
        const data = await res.json();
        fillForm(data);
    });
});