import express from "express";
const HOST = "localhost";
const PORT = 8000;
const appliation = express();
appliation.listen(PORT, HOST, () => console.log(`Server listening at ${HOST}:${PORT}...`));
