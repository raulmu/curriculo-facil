import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  private history: string[] = [];

  constructor(private router: Router, private _snackBar: MatSnackBar) {}

  navigateTo(url: string) {
    this.history.push(url);
    this.router.navigateByUrl(url).then(
      (_) => {
        //works only because we hooked the routeReuseStrategy.shouldReuseRoute above
      },
      (error) => {
        console.log({ error });
        this._snackBar.open(`Algo errado não está certo: falhou`, 'fechar');
      }
    );
  }

  navigateToSite(url: string) {
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

  back() {
    this.history.pop();
    const url = this.history.length ? this.history.pop() : '/';
    this.navigateTo(url!);
  }
}
