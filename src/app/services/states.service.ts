import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  public states: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() { }
}
