import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiModel } from '../models/api-response.model';
import { State } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  public states: BehaviorSubject<State[]> = new BehaviorSubject<State[]>([]);

  constructor(private httpClient: HttpClient) { }

  public async getStates(): Promise<void> {
    const response = await lastValueFrom(this.httpClient.get<ApiModel>('db.json')
      .pipe(map((r: ApiModel) => r.states)));

    this.states.next(response);
  }
}
