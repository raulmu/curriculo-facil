import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const CEP_API = "https://brasilapi.com.br/api/cep/v2/{cep}";

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }

  getData(cep: string) {
    const cepWithouHifen = cep.replace('-', '');
    return this.http.get(CEP_API.replace('{cep}', cepWithouHifen));
  }
}
