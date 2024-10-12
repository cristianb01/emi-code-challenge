import { Component } from '@angular/core';
import { TaskComponent } from "../../components/task/task.component";
import { Task } from '../../models/task.model';

@Component({
  selector: 'emi-task-list',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  public testTask: Task;

  constructor() {
    this.testTask = {
      "title": "Complete Project Proposal",
      "description": "Prepare and submit the project proposal for approval.",
      "dueDate": new Date("2023-12-15"),
      "completed": false,
      "stateHistory": [
        {"state": "new", "date": new Date("2023-12-01")},
        {"state": "active", "date": new Date("2023-12-05")}
      ],
      "notes": [
        "Check proposal guidelines",
        "Include budget estimates"
      ]
    }
  }

  
}
