import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 5050;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname)));
// sirve para hacer DEBUGGING
// muestra los erchivos y sus estados al cargar la pagina

app.get("/", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "index.html"))
});

app.listen(port, () =>{
console.log(`Example app listening at http://localhost:${port}`);
});

