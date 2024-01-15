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

appliation.use("/api", express.urlencoded({
    extended: true
}));

appliation.use((request: express.Request, response: express.Response, next: express.NextFunction): void => {
    console.log(`Received ${request.method} request for ${request.path}`);
    next();
});


// ====================================================================================================
// Front End Files

// HTML, CSS, and image files
appliation.get(
    ["/", "/create", "/edit", "/styles.css", "/images/list-icon.png"],
    (request: express.Request, response: express.Response): void => {
        const filename: string = (function(): string {
            switch (request.path) {
                case "/": return "index.html";
                case "/create": return "create.html";
                case "/edit": return "edit.html";
                default: return request.path;
            }
        })();

        response.sendFile(path.join(directory, "../source", filename));
    }
);

// JavaScript files
appliation.get(["/client.js", "/edit.js"], (request: express.Request, response: express.Response): void => {
    response.sendFile(path.join(directory, request.path));
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

// Updates a task
// Request body must contain the properties:
// - name: string
// - deadline: string
// - description: string
// - complete: boolean
appliation.put("/api/tasks/:id", (request: express.Request, response: express.Response): void => {
    client
    .query(
        'UPDATE "TASK" SET "TASK_NAME" = $1, "TASK_DEADLINE" = $2, "TASK_DESCRIPTION" = $3, "TASK_COMPLETE" = $4 WHERE "TASK_ID" = $5',
        [request.body.name, request.body.deadline, request.body.description, request.body.complete, request.params.id]
    )
    .then((result: pg.QueryResult): void => {
        response.end();
    })
    .catch(console.error);
});

// Deletes a task
appliation.delete("/api/tasks/:id", (request: express.Request, response: express.Response): void => {
    client
    .query('DELETE FROM "TASK" WHERE "TASK_ID" = $1', [request.params.id])
    .then((result: pg.QueryResult): void => {
        response.end();
    })
    .catch(console.error);
});

// Creates a new task
// Request body must contain the properties:
// - name: string
// - deadline: string
// - description: string
// And optionally:
// - complete: boolean (defaults to false)
appliation.post("/api/tasks", (request: express.Request, response: express.Response): void => {
    console.log(request.body);
    client
    .query(
        'INSERT INTO "TASK" ("TASK_NAME", "TASK_DEADLINE", "TASK_DESCRIPTION", "TASK_COMPLETE") VALUES ($1, $2, $3, $4)',
        [request.body.name, request.body.deadline, request.body.description, request.body.complete ?? "false"]
    )
    .then((result: pg.QueryResult): void => {
        response.redirect("/");
    })
    .catch(console.error);
});


appliation.listen(PORT, HOST, () => console.log(`Server listening at ${HOST}:${PORT}...`));
