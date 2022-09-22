import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { NavigateService } from './services/navigate.service';
import { ProgressBarService } from './services/progress-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'curriculo-facil';
  showProgressBar = false;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public authService: AuthService,
    public nav: NavigateService,
    private progressBarService: ProgressBarService
  ) {
    let googleSvg = `${environment.baseHref}/assets/svg/google.svg`;
    this.matIconRegistry.addSvgIcon('google_logo', this.domSanitizer.bypassSecurityTrustResourceUrl(googleSvg));
    this.progressBarService.show.subscribe((value) => {
      this.showProgressBar = value;
    });
  }

  logout(){
    this.authService.signOut().then(() => {
      this.nav.navigateTo('/');
    });
  }
}


// site alsoasked
