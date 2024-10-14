import { Component, OnInit } from '@angular/core';
import { TaskComponent } from "../../components/task/task.component";
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'emi-task-list',
  standalone: true,
  imports: [TaskComponent, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  public tasks$!: Observable<Task[]>;
  public currentPage: number;
  private readonly paginationSize: number;

  constructor(private taskService: TaskService) {
    this.currentPage = 0;
    this.paginationSize = 5;
  }

  ngOnInit() {
    this.tasks$ = this.taskService.tasks$.pipe(map(tasks => tasks.filter(t => !t.completed)));
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

  public async onMarkAsCompleted(task: Task) {
    this.taskService.update(task);
    await this.loadTasks();
  }
  //#endregion
}
