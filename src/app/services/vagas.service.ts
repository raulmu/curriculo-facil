import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vaga } from '../models/vaga.model';
import { environment } from '../../environments/environment';
import vagasData from '../../assets/json/vagas.json';  

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  public vagas$:BehaviorSubject<Vaga[]> =  new BehaviorSubject<Vaga[]>([]);
  constructor() {
    this.vagas$.next(vagasData);
  }
}
