interface Task {
    TASK_ID: number,
    TASK_NAME: string,
    TASK_DEADLINE: string,
    TASK_DESCRIPTION: string,
    TASK_COMPLETE: boolean
}

fetch("/api/tasks")
.then((response: Response): Promise<Task[]> => response.json())
.then((tasks: Task[]): void => {
    console.log(tasks);
});
