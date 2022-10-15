import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-indisponivel',
  templateUrl: './indisponivel.component.html',
  styleUrls: ['./indisponivel.component.scss']
})
export class IndisponivelComponent implements OnInit {

  userUid: string;

  constructor(public nav: NavigateService, private authService: AuthService) { 
    this.userUid = authService.userData ? authService.userData.uid : '';
  }

  ngOnInit(): void {
  }

  queroSerNotificado() {
    const user = this.authService.userData;
    if(user){
      user['querAssinar'] = true;
      this.authService.setUserData(user).then((_) => {
        this.nav.navigateTo('/', user.uid)
      });
    } 
  }

}
