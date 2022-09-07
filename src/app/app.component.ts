import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'curriculo-facil';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    let googleSvg = `${environment.baseHref}/assets/svg/google.svg`;
    this.matIconRegistry.addSvgIcon('google_logo', this.domSanitizer.bypassSecurityTrustResourceUrl(googleSvg));
  }
}


// site alsoasked
