import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AssetsService } from './services/assets.service';
import { AuthService } from './services/auth.service';
import { NavigateService } from './services/navigate.service';
import { ProgressBarService } from './services/progress-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showProgressBar = false;
  public urlFaleConosco = environment.urlFaleConosco;
  userUid: string;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public authService: AuthService,
    public nav: NavigateService,
    private assets: AssetsService,
    private progressBarService: ProgressBarService
  ) {
    this.userUid = authService.userData ? authService.userData.uid : '';
    let googleSvg = this.assets.getUrl('/assets/svg/google.svg');
    this.matIconRegistry.addSvgIcon('google_logo', this.domSanitizer.bypassSecurityTrustResourceUrl(googleSvg));
    this.progressBarService.show.subscribe((value) => {
      this.showProgressBar = value;
    });
  }

  logout(){
    this.authService.signOut().then(() => {
      this.nav.navigateTo('/', this.userUid);
    });
  }
}


// site alsoasked
// Imagens por <a href="https://pixabay.com/pt//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4568761">Pixabay</a>
// https://alsoasked.com/search?term=curr%C3%ADculo&language=pt&region=br&depth=2&search_id=nbqwmg9JGyo2BPx1DdopY8re1v3l6xKD&new_search=true&user_level=guest

