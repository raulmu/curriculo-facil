import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  private history: string[] = [];

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private analytics: AngularFireAnalytics
  ) {}

  navigateTo(url: string, userId: string) {
    if (userId) this.analytics.setUserId(userId);
    let urlStr = url;
    if(urlStr.length > 1 && urlStr.includes('/')) {
      urlStr = urlStr.split('/')[0]
    }
    const amb = environment.production ? 'prod' : 'dev';
    this.analytics.logEvent(`${amb}-${urlStr}`, {
      userId,
      url,
      data: new Intl.DateTimeFormat('en-US').format(new Date()),
      prod: environment.production,
    });
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

  navigateToSite(url: string, userId: string) {
    const amb = environment.production ? 'prod' : 'dev';
    if (userId) this.analytics.setUserId(userId!);
    this.analytics.logEvent(`${amb}-${url}`, {
      userId,
      url,
      data: new Intl.DateTimeFormat('en-US').format(new Date()),
      prod: environment.production,
    });
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

  back(userId: string) {
    this.history.pop();
    const url = this.history.length ? this.history.pop() : '/';
    this.navigateTo(url!, userId);
  }
}
