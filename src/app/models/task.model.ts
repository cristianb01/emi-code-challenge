import { TaskState } from "./task-state.model";

export interface Task {
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    stateHistory: TaskState[];
    notes: string[];

}
