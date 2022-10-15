import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-adicionais',
  templateUrl: './adicionais.component.html',
  styleUrls: ['./adicionais.component.scss']
})
export class AdicionaisComponent implements OnInit {

  userUid: string;

  constructor(public nav: NavigateService, private authService: AuthService) {
    this.userUid = authService.userData ? authService.userData.uid : '';
   }

  ngOnInit(): void {
  }

  back() {
    this.nav.back(this.userUid);
  }

}
