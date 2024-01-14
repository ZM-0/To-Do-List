import express from "express";
import path from "node:path";
import url from "node:url";
import pg from "pg";
const appliation = express();
const HOST = "localhost";
const PORT = 8000;
const directory = path.dirname(url.fileURLToPath(import.meta.url));
// ====================================================================================================
// Database Setup
// Must set environment variables PGUSER and PGPASSWORD to Postgres username and password
const client = new pg.Client({
    host: "localhost",
    port: 5432,
    database: "tododata"
});
await client.connect();
// try {
//     const response: pg.QueryResult = await client.query('SELECT * FROM "TASK"');
//     console.log(response.rows);
// } catch (error) {
//     console.error(error);
// } finally {
//     await client.end();
// }
// ====================================================================================================
// Middleware
appliation.use((request, response, next) => {
    console.log(`Received ${request.method} request for ${request.path}`);
    next();
});
// ====================================================================================================
// API
// Gets the list of tasks
appliation.get("/api/tasks", (request, response) => {
    client
        .query('SELECT * FROM "TASK"')
        .then((result) => {
        response.json(result.rows);
    })
        .catch(console.error);
});
// Gets a particular task by its identifier
appliation.get("/api/tasks/:id", (request, response) => {
    client
        .query('SELECT * FROM "TASK" WHERE "TASK_ID" = $1', [request.params.id])
        .then((result) => {
        response.json(result.rows[0]);
    })
        .catch(console.error);
});
appliation.listen(PORT, HOST, () => console.log(`Server listening at ${HOST}:${PORT}...`));
