const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

//do testów potem zamiast tego podłączyć databse
/*
const objects = [
    { id: 1, name: "Albert Einstein", score: 98, country: "Germany", year: 1879 },
    { id: 2, name: "Marie Curie", score: 95, country: "Poland", year: 1867 },
    { id: 3, name: "Isaac Newton", score: 97, country: "UK", year: 1643 },
    { id: 4, name: "Nikola Tesla", score: 94, country: "Serbia", year: 1856 }
];
*/

const objects=[
    {article_id: 1, full_name: "Plato", sex: "Male", birth_year: -4, city: "Athens", state: null, country: "Greece", continent: "Europe", latitude: 32.5, longitude: 34.9, occupation: "Philosopher", industry: "Philosophy", domain: "Humanities", article_languages: 142, page_views: 432135, average_views: 53252, historical_popularity_index: 31.9993},
    {article_id: 2, full_name: "Ropuchus Maximus", sex: "Female", birth_year: 1546, city: "Froggers", state: null, country: "Mongolia", continent: "Asia", latitude: 3.6, longitude: 123, occupation: "Frogknower", industry: "Nature", domain: "Nature", article_languages: 3, page_views: 654, average_views: 3, historical_popularity_index: 32.93},
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

//GET /objects
//TODO podpiąć żeby pokazywało z database, a poza tym działa
app.get("/objects", (req, res) => {
    res.json(objects);
});

//GET /objects?name=
//TODO zmienic name na inna kolumne - zdecydowac jaką
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

//POST /object
//narazie dodaje przykladowy rekord (dokladnie we frontend/core.js opisany)
//TODO zmienic zeby dodawalo wpisany przez uzytkownika
app.post("/object", (req, res) => {
    const newObj = req.body;

    newObj.id = objects.length + 1;
    objects.push(newObj);

    res.json({
        message: "Object added",
        object: newObj
    });
});

//PUT /object
//narazie zmienia przykladowy rekord na przykładowy (dokladnie we frontend/core.js opisany)
//TODO zrobic zeby zmienialo podany rekord i żeby ogólnie działało
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