import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiModel } from '../models/api-response.model';
import { State } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  public states: BehaviorSubject<State[]> = new BehaviorSubject<State[]>([]);

  constructor(private httpClient: HttpClient) { }

  public async getStates(): Promise<void> {
    try {
      const response = await lastValueFrom(this.httpClient.get<ApiModel>('db.json')
        .pipe(map((r: ApiModel) => r.states)));
  
      this.states.next(response);
    }
    catch(error: any) {
      switch (error.status) {
        case 404: 
          return Promise.reject('Could not find state data in the server');
        case 403:
          return Promise.reject('You are not allowed to get states');
        case 500: 
          return Promise.reject('An serverside error ocurred');
        default:
          return Promise.reject('An unexpected error ocurred. Try again later');
      }
    }
  }
}
