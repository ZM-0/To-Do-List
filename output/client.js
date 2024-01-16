"use strict";
// ====================================================================================================
// Client Task Setup
const taskListDisplay = document.querySelector("ul");
const taskCountDisplay = document.querySelector("header h2");
let allTasks;
let displayFilter;
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
 * Builds the complete button for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the complete button.
 */
const buildCompleteButton = function (index) {
    const completeIcon = document.createElement("span");
    completeIcon.classList.add("material-symbols-outlined", "icon-button");
    completeIcon.innerText = allTasks[index].TASK_COMPLETE ? "check_box" : "check_box_outline_blank";
    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-button");
    completeButton.append(completeIcon);
    completeButton.addEventListener("click", () => {
        allTasks[index].TASK_COMPLETE = !allTasks[index].TASK_COMPLETE;
        const body = new URLSearchParams();
        body.append("name", allTasks[index].TASK_NAME);
        body.append("deadline", allTasks[index].TASK_DEADLINE);
        body.append("description", allTasks[index].TASK_DESCRIPTION);
        body.append("complete", allTasks[index].TASK_COMPLETE ? "true" : "false");
        fetch(`/api/tasks/${allTasks[index].TASK_ID}`, { method: "PUT", body })
            .then((response) => {
            drawTasks(displayFilter);
        });
    });
    const container = document.createElement("div");
    container.classList.add("centre", "complete-container");
    container.append(completeButton);
    return container;
};
/**
 * Builds the edit button for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the edit button container.
 */
const buildEditButton = function (index) {
    const editIcon = document.createElement("span");
    editIcon.classList.add("material-symbols-outlined", "icon-button");
    editIcon.innerText = "edit";
    const editButton = document.createElement("a");
    editButton.href = "/edit";
    editButton.append(editIcon);
    editButton.addEventListener("click", () => {
        sessionStorage.setItem("editTaskID", String(allTasks[index].TASK_ID));
    });
    const container = document.createElement("div");
    container.classList.add("centre", "edit-container");
    container.append(editButton);
    return container;
};
/**
 * Builds the delete button for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the delete button.
 */
const buildDeleteButton = function (index) {
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-symbols-outlined", "icon-button");
    deleteIcon.innerText = "delete";
    const deleteButton = document.createElement("button");
    deleteButton.append(deleteIcon);
    deleteButton.addEventListener("click", () => {
        fetch(`/api/tasks/${allTasks[index].TASK_ID}`, { method: "DELETE" })
            .then((response) => {
            allTasks.splice(index, 1);
            document.querySelector(`#task-${allTasks[index].TASK_ID}`)?.remove();
            taskCountDisplay.innerText = `Count: ${allTasks.length}`;
        });
    });
    const container = document.createElement("div");
    container.classList.add("centre", "delete-container");
    container.append(deleteButton);
    return container;
};
/**
 * Builds the title for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the title.
 */
const buildTitle = function (index) {
    const title = document.createElement("h2");
    title.innerText = allTasks[index].TASK_NAME;
    return title;
};
/**
 * Builds the deadline for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the deadline.
 */
const buildDeadline = function (index) {
    const deadline = document.createElement("h3");
    const time = document.createElement("time");
    time.dateTime = allTasks[index].TASK_DEADLINE;
    time.innerText = getFormattedDeadline(new Date(allTasks[index].TASK_DEADLINE));
    deadline.append("Due: ", time);
    return deadline;
};
/**
 * Builds the description for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the description.
 */
const buildDescription = function (index) {
    const description = document.createElement("p");
    description.innerText = allTasks[index].TASK_DESCRIPTION;
    return description;
};
/**
 * Generates HTML for a task and adds it to the DOM.
 * @param index The index of the task to add in allTasks.
 */
const addTaskToDOM = function (index) {
    const listItem = document.createElement("li");
    listItem.setAttribute("id", `task-${allTasks[index].TASK_ID}`);
    const article = document.createElement("article");
    article.append(buildTitle(index), buildDeadline(index), buildDescription(index), buildCompleteButton(index), buildEditButton(index), buildDeleteButton(index));
    listItem.append(article);
    taskListDisplay.append(listItem);
};
/**
 * Draws the list of tasks on the page.
 * @param filter Identifies which tasks to draw: "all", "complete", or "incomplete".
 */
const drawTasks = function (filter) {
    displayFilter = filter;
    taskListDisplay.innerHTML = "";
    switch (filter) {
        case "all":
            allTasks.forEach((task, index) => addTaskToDOM(index));
            taskCountDisplay.innerText = `Count: ${allTasks.length}`;
            break;
        case "complete":
            allTasks.forEach((task, index) => {
                if (task.TASK_COMPLETE)
                    addTaskToDOM(index);
            });
            taskCountDisplay.innerText = `Count: ${allTasks.filter((task) => task.TASK_COMPLETE).length}`;
            break;
        case "incomplete":
            allTasks.forEach((task, index) => {
                if (!task.TASK_COMPLETE)
                    addTaskToDOM(index);
            });
            taskCountDisplay.innerText = `Count: ${allTasks.filter((task) => !task.TASK_COMPLETE).length}`;
            break;
    }
};
// ====================================================================================================
// Task Filtering
const filterAllButton = document.querySelector("#filter-all");
const filterCompleteButton = document.querySelector("#filter-complete");
const filterIncompleteButton = document.querySelector("#filter-incomplete");
filterAllButton.addEventListener("click", () => {
    drawTasks("all");
});
filterCompleteButton.addEventListener("click", () => {
    drawTasks("complete");
});
filterIncompleteButton.addEventListener("click", () => {
    drawTasks("incomplete");
});
fetch("/api/tasks")
    .then((response) => response.json())
    .then((tasks) => {
    // console.log(tasks);
    allTasks = tasks;
    drawTasks("all");
});
