import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-excluir-perfil',
  templateUrl: './excluir-perfil.component.html',
  styleUrls: ['./excluir-perfil.component.scss'],
})
export class ExcluirPerfilComponent implements OnInit {
  constructor(public authService: AuthService, private _nav: NavigateService) {}
  ngOnInit(): void {}
  googleLogin() {
    this.authService.googleLogin().then((_) => {
      this.authService.deleteUser().then((_) => {
        this._nav.navigateTo('/');
      });
    });
  }
  emailLogin(email: string, password: string) {
    this.authService.signIn(email, password).then((_) => {
      this.authService.deleteUser().then((_) => {
        this._nav.navigateTo('/');
      });
    });
  }
  onEnter(userEmail: string, userPassword: string) {
    this.authService.signIn(userEmail, userPassword);
  }
}
