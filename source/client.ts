// ====================================================================================================
// Client Task Setup

interface Task {
    TASK_ID: number,
    TASK_NAME: string,
    TASK_DEADLINE: string,
    TASK_DESCRIPTION: string,
    TASK_COMPLETE: boolean
}

const taskListDisplay: HTMLUListElement = document.querySelector("ul")!;
const taskCountDisplay: HTMLHeadingElement = document.querySelector("header h2")!;

let allTasks: Task[];
let displayFilter: string;


// ====================================================================================================
// Task HTML Generation

const MONTHS: string[] = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

/**
 * Formats a task deadline.
 * @param deadline The deadline date and time.
 * @returns The deadline in the format dd mmmm, hh:mm AM/PM.
 */
const getFormattedDeadline = function(deadline: Date): string {
    const hours: number = deadline.getHours() % 12 === 0 ? 12 : deadline.getHours() % 12;
    const minutes: string = String(deadline.getMinutes()).padStart(2, '0');
    const period: string = deadline.getHours() < 12 ? "AM" : "PM";

    return `${deadline.getDate()} ${MONTHS[deadline.getMonth()]}, ${hours}:${minutes} ${period}`;
}

/**
 * Builds the complete button for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the complete button.
 */
const buildCompleteButton = function(index: number): HTMLButtonElement {
    const completeButton: HTMLButtonElement = document.createElement("button");
    completeButton.innerText = allTasks[index].TASK_COMPLETE ? "Is Complete" : "Is Incomplete";

    completeButton.addEventListener("click", (): void => {
        allTasks[index].TASK_COMPLETE = !allTasks[index].TASK_COMPLETE;

        const body: URLSearchParams = new URLSearchParams();
        body.append("name", allTasks[index].TASK_NAME);
        body.append("deadline", allTasks[index].TASK_DEADLINE);
        body.append("description", allTasks[index].TASK_DESCRIPTION);
        body.append("complete", allTasks[index].TASK_COMPLETE ? "true" : "false");

        fetch(`/api/tasks/${allTasks[index].TASK_ID}`, { method: "PUT", body })
        .then((response: Response): void => {
            drawTasks(displayFilter);
            // completeButton.innerText = allTasks[index].TASK_COMPLETE ? "Is Complete" : "Is Incomplete";
        });
    });

    return completeButton;
}

/**
 * Builds the edit button for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the edit button.
 */
const buildEditButton = function(index: number): HTMLAnchorElement {
    const editButton: HTMLAnchorElement = document.createElement("a");
    editButton.href = "/edit";
    editButton.innerText = "Edit";

    editButton.addEventListener("click", (): void => {
        sessionStorage.setItem("editTaskID", String(allTasks[index].TASK_ID));
    });

    return editButton;
}

/**
 * Builds the delete button for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the delete button.
 */
const buildDeleteButton = function(index: number): HTMLButtonElement {
    const deleteButton: HTMLButtonElement = document.createElement("button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", (): void => {
        fetch(`/api/tasks/${allTasks[index].TASK_ID}`, { method: "DELETE" })
        .then((response: Response): void => {
            allTasks.splice(index, 1);
            document.querySelector(`#task-${allTasks[index].TASK_ID}`)?.remove();
            taskCountDisplay.innerText = `Count: ${allTasks.length}`;
        });
    });

    return deleteButton;
}

/**
 * Builds the title for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the title.
 */
const buildTitle = function(index: number): HTMLHeadingElement {
    const title: HTMLHeadingElement = document.createElement("h2");
    title.innerText = allTasks[index].TASK_NAME;
    return title;
}

/**
 * Builds the deadline for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the deadline.
 */
const buildDeadline = function(index: number): HTMLHeadingElement {
    const deadline: HTMLHeadingElement = document.createElement("h3");
    const time: HTMLTimeElement = document.createElement("time");
    time.dateTime = allTasks[index].TASK_DEADLINE;
    time.innerText = getFormattedDeadline(new Date(allTasks[index].TASK_DEADLINE));
    deadline.append("Deadline: ", time);
    return deadline;
}

/**
 * Builds the description for the task display.
 * @param index The task index in allTasks.
 * @returns The DOM element for the description.
 */
const buildDescription = function(index: number): HTMLParagraphElement {
    const description: HTMLParagraphElement = document.createElement("p");
    description.innerText = allTasks[index].TASK_DESCRIPTION;
    return description;
}

/**
 * Generates HTML for a task and adds it to the DOM.
 * @param index The index of the task to add in allTasks.
 */
const addTaskToDOM = function(index: number): void {
    const listItem: HTMLLIElement = document.createElement("li");
    listItem.setAttribute("id", `task-${allTasks[index].TASK_ID}`);

    const article: HTMLElement = document.createElement("article");
    article.append(
        buildTitle(index),
        buildDeadline(index),
        buildDescription(index),
        buildCompleteButton(index),
        buildEditButton(index),
        buildDeleteButton(index)
    );

    listItem.append(article);
    taskListDisplay.append(listItem);
}


/**
 * Draws the list of tasks on the page.
 * @param filter Identifies which tasks to draw: "all", "complete", or "incomplete".
 */
const drawTasks = function(filter: string): void {
    displayFilter = filter;
    taskListDisplay.innerHTML = "";

    switch (filter) {
        case "all":
            allTasks.forEach((task: Task, index: number): void => addTaskToDOM(index));
            taskCountDisplay.innerText = `Count: ${allTasks.length}`;
            break;
        case "complete":
            allTasks.forEach((task: Task, index: number): void => {
                if (task.TASK_COMPLETE) addTaskToDOM(index);
            });
            taskCountDisplay.innerText = `Count: ${allTasks.filter((task: Task): boolean => task.TASK_COMPLETE).length}`;
            break;
        case "incomplete":
            allTasks.forEach((task: Task, index: number): void => {
                if (!task.TASK_COMPLETE) addTaskToDOM(index);
            });
            taskCountDisplay.innerText = `Count: ${allTasks.filter((task: Task): boolean => !task.TASK_COMPLETE).length}`;
            break;
    }
}


// ====================================================================================================
// Task Filtering

const filterAllButton: HTMLButtonElement = document.querySelector("#filter-all")!;
const filterCompleteButton: HTMLButtonElement = document.querySelector("#filter-complete")!;
const filterIncompleteButton: HTMLButtonElement = document.querySelector("#filter-incomplete")!;

filterAllButton.addEventListener("click", (): void => {
    drawTasks("all");
});

filterCompleteButton.addEventListener("click", (): void => {
    drawTasks("complete");
});

filterIncompleteButton.addEventListener("click", (): void => {
    drawTasks("incomplete");
});


fetch("/api/tasks")
.then((response: Response): Promise<Task[]> => response.json())
.then((tasks: Task[]): void => {
    // console.log(tasks);
    allTasks = tasks;
    drawTasks("all");
});
