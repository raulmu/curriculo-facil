import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  public dataUrl:BehaviorSubject<string> =  new BehaviorSubject<string>('');
  constructor() {}
}
