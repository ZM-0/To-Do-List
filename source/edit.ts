interface Task {
    TASK_ID: number,
    TASK_NAME: string,
    TASK_DEADLINE: string,
    TASK_DESCRIPTION: string,
    TASK_COMPLETE: boolean
}

const editTaskID: string = sessionStorage.getItem("editTaskID")!;

const nameDisplay: HTMLInputElement = document.querySelector("#name")!;
const deadlineDisplay: HTMLInputElement = document.querySelector("#deadline")!;
const descriptionDisplay: HTMLTextAreaElement = document.querySelector("#description")!;
const completeDisplay: HTMLInputElement = document.querySelector("#complete")!;
const saveButton: HTMLButtonElement = document.querySelector("form .save-button")!;

// Save the updated task
saveButton.addEventListener("click", (): void => {
    const body: URLSearchParams = new URLSearchParams();
    body.append("name", nameDisplay.value);

    const deadline: Date = new Date(deadlineDisplay.value);
    body.append("deadline", deadline.toISOString());

    body.append("description", descriptionDisplay.value);
    body.append("complete", completeDisplay.checked ? "true" : "false");

    fetch(`/api/tasks/${editTaskID}`, { method: "PUT", body });
    location.assign("/");
});

// Fetch and display the task to be edited in the form
fetch(`/api/tasks/${editTaskID}`)
.then((response: Response): Promise<Task> => response.json())
.then((task: Task): void => {
    nameDisplay.value = task.TASK_NAME;

    const deadline: Date = new Date(task.TASK_DEADLINE);
    const year: string = String(deadline.getFullYear());
    const month: string = String(deadline.getMonth() + 1).padStart(2, '0');
    const date: string = String(deadline.getDate()).padStart(2, '0');
    const hour: string = String(deadline.getHours()).padStart(2, '0');
    const minute: string = String(deadline.getMinutes()).padStart(2, '0');
    deadlineDisplay.value = `${year}-${month}-${date}T${hour}:${minute}`;

    descriptionDisplay.value = task.TASK_DESCRIPTION;

    if (task.TASK_COMPLETE) {
        completeDisplay.setAttribute("checked", "true");
    }
});
