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
appliation.use("/api", express.urlencoded({
    extended: true
}));
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
// Updates a task
// Request body must contain the properties:
// - name: string
// - deadline: string
// - description: string
// - complete: boolean
appliation.put("/api/tasks/:id", (request, response) => {
    client
        .query('UPDATE "TASK" SET "TASK_NAME" = $1, "TASK_DEADLINE" = $2, "TASK_DESCRIPTION" = $3, "TASK_COMPLETE" = $4 WHERE "TASK_ID" = $5', [request.body.name, request.body.deadline, request.body.description, request.body.complete, request.params.id])
        .then((result) => {
        response.end();
    })
        .catch(console.error);
});
// Deletes a task
appliation.delete("/api/tasks/:id", (request, response) => {
    client
        .query('DELETE FROM "TASK" WHERE "TASK_ID" = $1', [request.params.id])
        .then((result) => {
        response.end();
    })
        .catch(console.error);
});
appliation.listen(PORT, HOST, () => console.log(`Server listening at ${HOST}:${PORT}...`));
