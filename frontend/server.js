import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = 5173;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "index.html"))
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on => http://localhost:${port}`);
});