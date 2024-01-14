import express from "express";
import path from "node:path";
import url from "node:url";
import pg from "pg"


const appliation: express.Application = express();
const HOST: string = "localhost";
const PORT: number = 8000;
const directory: string = path.dirname(url.fileURLToPath(import.meta.url));


// ====================================================================================================
// Database Setup

// Must set environment variables PGUSER and PGPASSWORD to Postgres username and password
const client: pg.Client = new pg.Client({
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

appliation.use((request: express.Request, response: express.Response, next: express.NextFunction): void => {
    console.log(`Received ${request.method} request for ${request.path}`);
    next();
});


// ====================================================================================================
// API

// Gets the list of tasks
appliation.get("/api/tasks", (request: express.Request, response: express.Response): void => {
    client
    .query('SELECT * FROM "TASK"')
    .then((result: pg.QueryResult): void => {
        response.json(result.rows);
    })
    .catch(console.error);
});

// Gets a particular task by its identifier
appliation.get("/api/tasks/:id", (request: express.Request, response: express.Response): void => {
    client
    .query('SELECT * FROM "TASK" WHERE "TASK_ID" = $1', [request.params.id])
    .then((result: pg.QueryResult): void => {
        response.json(result.rows[0]);
    })
    .catch(console.error);
});


appliation.listen(PORT, HOST, () => console.log(`Server listening at ${HOST}:${PORT}...`));
