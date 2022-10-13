import { Component, OnInit } from '@angular/core';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss'],
})
export class PagamentoComponent implements OnInit {
  constructor(public nav: NavigateService) {}

  ngOnInit(): void {}
}
