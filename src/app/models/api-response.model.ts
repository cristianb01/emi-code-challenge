import { State } from "./state.model";
import { Task } from "./task.model";

export interface ApiModel {
    tasks: Task[],
    states: State[];
}
