"use strict";
fetch("/api/tasks")
    .then((response) => response.json())
    .then((tasks) => {
    console.log(tasks);
});
