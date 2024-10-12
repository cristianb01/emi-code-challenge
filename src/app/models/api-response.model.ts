import { Task } from "./task.model";

export interface ApiModel {
    tasks: Task[],
    states: string[];
}
