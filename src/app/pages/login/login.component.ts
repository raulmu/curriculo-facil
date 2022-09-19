import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private _nav: NavigateService
  ) {}

  ngOnInit(): void {
    this.authService.didLoggedIn.subscribe((loggedIn) => {
      console.log({ loggedIn });
      if (loggedIn) {
        this.authService.getUserData(this.authService.userData?.uid!).subscribe();
        this._nav.navigateTo('/');
      }
    });
  }

  googleLogin() {
    this.authService.googleLogin();
  }
}
