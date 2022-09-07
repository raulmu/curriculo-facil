import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  navigateTo(url: string) {
    this.router.navigateByUrl(url).then(
      (worked) => {
        if(!worked) this._snackBar.open(
          `Algo errado não está certo: não funcionou`,
          'fechar'
        );
        //works only because we hooked the routeReuseStrategy.shouldReuseRoute above
      },
      (error) => {
        this._snackBar.open(
          `Algo errado não está certo: falhou`,
          'fechar'
        );
     });
  }
}
