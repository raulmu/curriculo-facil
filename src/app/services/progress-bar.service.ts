import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  public show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }
}
