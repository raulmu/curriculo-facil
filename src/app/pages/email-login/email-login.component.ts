import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss'],
})
export class EmailLoginComponent implements OnInit {

  constructor(public authService: AuthService, private _nav: NavigateService) {
    this.authService.user.subscribe((user) => {
      console.log({user});
      if(user) this._nav.navigateTo('/');
    });
  }

  ngOnInit(): void {}

  onEnter(userEmail: string, userPassword: string) {
    this.authService.signIn(userEmail, userPassword)
  }
}
