import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map, Observable } from 'rxjs';
import { Task } from '../models/task.model';
// import * as jsonData from '../../assets/db.json';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  public $tasks = this.tasks.asObservable();

  constructor(private httpClient: HttpClient) { }

  public async get(skip: number, take: number): Promise<void> {
    const response = await lastValueFrom(this.httpClient.get('db.json')
      .pipe(
        map((r: any) => r.tasks),
        map((tasks: Task[]) => tasks.slice(skip, skip + take - 1))
      ));

    this.tasks.next(response);
  }
}
