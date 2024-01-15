"use strict";
const taskList = document.querySelector("ul");
const taskCountDisplay = document.querySelector("header h2");
let taskCount = 0;
// ====================================================================================================
// Task HTML Generation
const MONTHS = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
/**
 * Formats a task deadline.
 * @param deadline The deadline date and time.
 * @returns The deadline in the format dd mmmm, hh:mm AM/PM.
 */
const getFormattedDeadline = function (deadline) {
    const hours = deadline.getHours() % 12 === 0 ? 12 : deadline.getHours() % 12;
    const minutes = String(deadline.getMinutes()).padStart(2, '0');
    const period = deadline.getHours() < 12 ? "AM" : "PM";
    return `${deadline.getDate()} ${MONTHS[deadline.getMonth()]}, ${hours}:${minutes} ${period}`;
};
/**
 * Generates HTML for a task and adds it to the DOM.
 * @param task The task to add.
 */
const addTaskToDOM = function (task) {
    const listItem = document.createElement("li");
    listItem.setAttribute("id", `task-${task.TASK_ID}`);
    const deadline = new Date(task.TASK_DEADLINE);
    listItem.innerHTML = `
      <article>
        <h2>${task.TASK_NAME}</h2>
        <h3>Deadline: <time datetime="${task.TASK_DEADLINE}">${getFormattedDeadline(deadline)}</time></h3>
        <p>${task.TASK_DESCRIPTION}</p>
        <button class="complete-button">Is ${task.TASK_COMPLETE ? "Complete" : "Incomplete"}</button>
        <a href="/edit" class="edit-button">Edit</a>
        <button class="delete-button">Delete</button>
      </article>
    `;
    taskList.append(listItem);
    const completeButton = document.querySelector(`#task-${task.TASK_ID} .complete-button`);
    completeButton.addEventListener("click", () => {
        task.TASK_COMPLETE = !task.TASK_COMPLETE;
        const body = new URLSearchParams();
        body.append("name", task.TASK_NAME);
        body.append("deadline", task.TASK_DEADLINE);
        body.append("description", task.TASK_DESCRIPTION);
        body.append("complete", task.TASK_COMPLETE ? "true" : "false");
        fetch(`/api/tasks/${task.TASK_ID}`, { method: "PUT", body })
            .then((response) => {
            completeButton.innerText = task.TASK_COMPLETE ? "Is Complete" : "Is Incomplete";
        });
    });
    const editButton = document.querySelector(`#task-${task.TASK_ID} .edit-button`);
    editButton.addEventListener("click", () => {
        sessionStorage.setItem("editTaskID", String(task.TASK_ID));
    });
    const deleteButton = document.querySelector(`#task-${task.TASK_ID} .delete-button`);
    deleteButton.addEventListener("click", () => {
        fetch(`/api/tasks/${task.TASK_ID}`, { method: "DELETE" })
            .then((response) => {
            listItem.remove();
            taskCountDisplay.innerText = `Count: ${--taskCount}`;
        });
    });
};
fetch("/api/tasks")
    .then((response) => response.json())
    .then((tasks) => {
    console.log(tasks);
    taskCount = tasks.length;
    taskCountDisplay.innerText = `Count: ${taskCount}`;
    for (let i = 0; i < tasks.length; i++) {
        addTaskToDOM(tasks[i]);
    }
});
