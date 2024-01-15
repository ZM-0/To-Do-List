"use strict";
const MONTHS = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const taskList = document.querySelector("ul");
const taskCount = document.querySelector("header h2");
// ====================================================================================================
// Task HTML Generation
const getFormattedDeadline = function (deadline) {
    const hours = 0 === deadline.getHours() % 12 ? 12 : deadline.getHours() % 12;
    return `${deadline.getDate()} ${MONTHS[deadline.getMonth()]}, ${String(hours)}:${String(deadline.getMinutes()).padStart(2, "0")} ${12 > deadline.getHours() ? "AM" : "PM"}`;
};
/**
 * Generates HTML for a task and adds it to the DOM.
 * @param task The task to add.
 */
const addTaskToDOM = function (task) {
    const listItem = document.createElement("li");
    const deadline = new Date(task.TASK_DEADLINE);
    listItem.innerHTML = `
      <article>
        <h2>${task.TASK_NAME}</h2>
        <h3>Deadline: <time datetime="${task.TASK_DEADLINE}">${getFormattedDeadline(deadline)}</time></h3>
        <p>${task.TASK_DESCRIPTION}</p>
        <button>Complete</button>
        <a href="#">Edit</a>
        <button>Delete</button>
      </article>
    `;
    taskList.append(listItem);
};
fetch("/api/tasks")
    .then((response) => response.json())
    .then((tasks) => {
    console.log(tasks);
    taskCount.innerText = `Count: ${tasks.length}`;
    for (let i = 0; i < tasks.length; i++) {
        addTaskToDOM(tasks[i]);
    }
});
