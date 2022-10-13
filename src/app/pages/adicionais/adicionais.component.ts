import { Component, OnInit } from '@angular/core';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-adicionais',
  templateUrl: './adicionais.component.html',
  styleUrls: ['./adicionais.component.scss']
})
export class AdicionaisComponent implements OnInit {

  constructor(public nav: NavigateService) { }

  ngOnInit(): void {
  }

  back() {
    this.nav.back();
  }

}
