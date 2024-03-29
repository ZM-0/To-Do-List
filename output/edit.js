"use strict";
const editTaskID = sessionStorage.getItem("editTaskID");
const nameDisplay = document.querySelector("#name");
const deadlineDisplay = document.querySelector("#deadline");
const descriptionDisplay = document.querySelector("#description");
const completeDisplay = document.querySelector("#complete");
const saveButton = document.querySelector("form .save-button");
// Save the updated task
saveButton.addEventListener("click", () => {
    const body = new URLSearchParams();
    body.append("name", nameDisplay.value);
    const deadline = new Date(deadlineDisplay.value);
    body.append("deadline", deadline.toISOString());
    body.append("description", descriptionDisplay.value);
    body.append("complete", completeDisplay.checked ? "true" : "false");
    fetch(`/api/tasks/${editTaskID}`, { method: "PUT", body });
    location.assign("/");
});
// Fetch and display the task to be edited in the form
fetch(`/api/tasks/${editTaskID}`)
    .then((response) => response.json())
    .then((task) => {
    nameDisplay.value = task.TASK_NAME;
    const deadline = new Date(task.TASK_DEADLINE);
    const year = String(deadline.getFullYear());
    const month = String(deadline.getMonth() + 1).padStart(2, '0');
    const date = String(deadline.getDate()).padStart(2, '0');
    const hour = String(deadline.getHours()).padStart(2, '0');
    const minute = String(deadline.getMinutes()).padStart(2, '0');
    deadlineDisplay.value = `${year}-${month}-${date}T${hour}:${minute}`;
    descriptionDisplay.value = task.TASK_DESCRIPTION;
    if (task.TASK_COMPLETE) {
        completeDisplay.setAttribute("checked", "true");
    }
});
