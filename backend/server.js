const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("AHOJ PRZYGODO!");
});


app.post("/command", (req, res) => {
    const { command } = req.body;

    console.log("AHOJ:", command);

    res.json({
        message: "AHOJKA SADEG",
        yourCommand: command
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});