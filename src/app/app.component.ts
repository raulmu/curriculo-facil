import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { NavigateService } from './services/navigate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'curriculo-facil';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public authService: AuthService,
    private _nav: NavigateService
  ) {
    let googleSvg = `${environment.baseHref}/assets/svg/google.svg`;
    this.matIconRegistry.addSvgIcon('google_logo', this.domSanitizer.bypassSecurityTrustResourceUrl(googleSvg));
  }

  logout(){
    this.authService.signOut().then(() => {
      this._nav.navigateTo('/');
    });
  }
}


// site alsoasked
