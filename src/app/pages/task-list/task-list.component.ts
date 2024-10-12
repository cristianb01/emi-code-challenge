import { Component, OnInit } from '@angular/core';
import { TaskComponent } from "../../components/task/task.component";
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'emi-task-list',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  public tasks!: Task[];
  public currentPage: number;
  private readonly paginationSize: number;

  constructor(private taskService: TaskService) {
    this.currentPage = 0;
    this.paginationSize = 5;
  }

  ngOnInit() {
    this.taskService.$tasks.subscribe(tasks => this.tasks = tasks);
    this.taskService.get(this.currentPage * this.paginationSize, this.paginationSize);
  }

  private loadTasks(): Promise<void> {
    return this.taskService.get(this.currentPage * this.paginationSize, this.paginationSize);
  }

  //#region Events
  public onPreviousPageButtonClick() {
    this.currentPage--;
    this.loadTasks();
  }

  public onNextPageButtonClick() {
    this.currentPage++;
    this.loadTasks();
  }

  public async onDeleteTask(task: Task) {
    await this.taskService.delete(task);
    await this.loadTasks();
  }
  //#endregion
}
