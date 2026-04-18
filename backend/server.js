const express = require("express");
const cors = require("cors");
const pool = require('./db');

const app = express();
const PORT = 3000;

//do testów potem zamiast tego podłączyć databse
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
app.get("/objects", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pantheon');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//GET /objects/ids
app.get("/objects/ids", async (req, res) => {
    try {
        const result = await pool.query('SELECT article_id FROM pantheon ORDER BY article_id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//GET /objects/id
app.get("/object/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const isFound = await pool.query(
            `SELECT * FROM pantheon WHERE article_id = $1`,
            [id]
        );
        if (isFound.rows.length === 0) {
            return res.status(404).json({ error: "Object not found" });
        }
        const result = await pool.query(`SELECT * FROM pantheon WHERE article_id = $1`,
            [id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//GET /objects?name=
app.get("/object", async (req, res) => {
    const { param, query } = req.query;

    const column = getColumnFromParam(param);

    if (!column || !query) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM pantheon WHERE `+column+` = $1`,
            [query]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//POST /object
app.post("/object", async (req, res) => {
    const {
        article_id,
        full_name,
        sex,
        birth_year,
        city,
        state,
        country,
        continent,
        latitude,
        longitude,
        occupation,
        industry,
        domain,
        article_languages,
        page_views,
        average_views,
        historical_popularity_index
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO pantheon (
                article_id,
                full_name,
                sex,
                birth_year,
                city,
                state,
                country,
                continent,
                latitude,
                longitude,
                occupation,
                industry,
                domain,
                article_languages,
                page_views,
                average_views,
                historical_popularity_index
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
            )`,
        [
            article_id,
            full_name,
            sex,
            birth_year,
            city,
            state,
            country,
            continent,
            latitude,
            longitude,
            occupation,
            industry,
            domain,
            article_languages,
            page_views,
            average_views,
            historical_popularity_index
        ]
    );
        res.status(201).json({
            message: "Added row",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//PUT /object
app.put("/object/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const {
        article_id,
        full_name,
        sex,
        birth_year,
        city,
        state,
        country,
        continent,
        latitude,
        longitude,
        occupation,
        industry,
        domain,
        article_languages,
        page_views,
        average_views,
        historical_popularity_index
    } = req.body;

    try {
        const isFound = await pool.query(
            `SELECT * FROM pantheon WHERE article_id = $1`,
            [id]
        );

        if (isFound.rows.length === 0) {
            return res.status(404).json({ error: "Object not found" });
        }

        const result = await pool.query(
            `UPDATE pantheon SET
                full_name = $1,
                sex = $2,
                birth_year = $3,
                city = $4,
                state = $5,
                country = $6,
                continent = $7,
                latitude = $8,
                longitude = $9,
                occupation = $10,
                industry = $11,
                domain = $12,
                article_languages = $13,
                page_views = $14,
                average_views = $15,
                historical_popularity_index = $16
                WHERE article_id = $17`,
            [
                full_name,
                sex,
                birth_year,
                city,
                state,
                country,
                continent,
                latitude,
                longitude,
                occupation,
                industry,
                domain,
                article_languages,
                page_views,
                average_views,
                historical_popularity_index,
                id
            ]
        );

        res.json({
            message: "Object updated",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

//GET /objects/stats
app.get("/objects/stats", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pantheon ORDER BY historical_popularity_index::float DESC LIMIT 5');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

function getColumnFromParam(param){
    switch (param) {
        case "1":
            return "article_id";
        case "2":
            return "full_name";
        case "3":
            return "sex";
        case "4":
            return "birth_year";
        case "5":
            return "city";
        case "6":
            return "state";
        case "7":
            return "country";
        case "8":
            return "continent";
        case "9":
            return "latitude";
        case "10":
            return "longitude";
        case "11":
            return "occupation";
        case "12":
            return "industry";
        case "13":
            return "domain";
        case "14":
            return "article_languages";
        case "15":
            return "page_views";
        case "16":
            return "average_views";
        case "17":
            return "historical_popularity_index";
        default:
            return null;
    }
}