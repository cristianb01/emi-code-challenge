import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map, Observable, tap } from 'rxjs';
import { Task } from '../models/task.model';
import { ApiModel } from '../models/api-response.model';
import * as fs from 'fs';

import { StatesService } from './states.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  public $tasks = this.tasks.asObservable();
  allTasks!: Task[];

  constructor(private httpClient: HttpClient, private statesService: StatesService) { }

  public async get(skip: number, take: number): Promise<void> {
    const response = await lastValueFrom(this.httpClient.get<ApiModel>('db.json')
      .pipe(
        tap((r: ApiModel) => this.statesService.states.next(r.states)),
        tap((r: ApiModel) => this.allTasks = r.tasks),
        map((r: ApiModel) => r.tasks),
        map((tasks: Task[]) => tasks.slice(skip, skip + take - 1))
      ));

    this.tasks.next(response);
  }

  public async delete(task: Task): Promise<void> {
    const filteredTask = this.allTasks.filter(t => t.title != task.title);

    const payload: ApiModel = {
      states: this.statesService.states.value,
      tasks: filteredTask
    };

    fs.writeFile('db.json', JSON.stringify(payload), (err) => {
      if (err) {
        console.error('Error writing to JSON file:', err);
      } else {
        console.log('JSON file written successfully');
      }
    });

    // await lastValueFrom(this.httpClient.put('db.json', payload));
  }
}
