import express from "express";

const HOST: string = "localhost";
const PORT: number = 8000;
const appliation: express.Application = express();

appliation.listen(PORT, HOST, () => console.log(`Server listening at ${HOST}:${PORT}...`));
