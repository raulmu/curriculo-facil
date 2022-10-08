import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() { }

  getUrl(path: string) {
    return `${environment.baseHref}${path}`;
  }
}
