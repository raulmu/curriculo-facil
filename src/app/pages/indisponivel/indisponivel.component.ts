import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-indisponivel',
  templateUrl: './indisponivel.component.html',
  styleUrls: ['./indisponivel.component.scss']
})
export class IndisponivelComponent implements OnInit {

  constructor(public nav: NavigateService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  queroSerNotificado() {
    const user = this.authService.userData;
    if(user){
      user['querAssinar'] = true;
      this.authService.setUserData(user).then((_) => {
        this.nav.navigateTo('/')
      });
    } 
  }

}
