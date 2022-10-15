import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss'],
})
export class PagamentoComponent implements OnInit {
  userUid: string;
  constructor(public nav: NavigateService, private authService: AuthService) {
    this.userUid = authService.userData ? authService.userData.uid : '';
  }

  ngOnInit(): void {}
}
