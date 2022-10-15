import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  public isPersisted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private dataUrl:BehaviorSubject<string> =  new BehaviorSubject<string>('');
  constructor() {}
  public setDataUrl(dataUrl: string) {
    this.dataUrl.next(dataUrl);
    this.isPersisted.next(false);
  }
  public getDataUrl(): BehaviorSubject<string> {
    return this.dataUrl;
  }

}
