const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

//do testów potem zamiast tego podłączyć databse
const objects = [
    { id: 1, name: "Albert Einstein", score: 98, country: "Germany", year: 1879 },
    { id: 2, name: "Marie Curie", score: 95, country: "Poland", year: 1867 },
    { id: 3, name: "Isaac Newton", score: 97, country: "UK", year: 1643 },
    { id: 4, name: "Nikola Tesla", score: 94, country: "Serbia", year: 1856 }
];

app.use(cors());
app.use(express.json());

/*
app.post("/command", (req, res) => {
    const { command } = req.body;

    console.log("AHOJ:", command);

    res.json({
        message: "AHOJKA",
        yourCommand: command
    });
});
*/

app.get("/objects", (req, res) => {
    res.json(objects);
});

app.get("/object", (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: "Missing name parameter" });
    }

    const result = objects.filter(obj =>
        obj.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json(result);
});

app.post("/object", (req, res) => {
    const newObj = req.body;

    newObj.id = objects.length + 1;
    objects.push(newObj);

    res.json({
        message: "Object added",
        object: newObj
    });
});

app.put("/object/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const update = req.body;

    const index = objects.findIndex(o => o.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Object not found" });
    }

    objects[index] = { ...objects[index], ...update };

    res.json({
        message: "Object updated",
        object: objects[index]
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});