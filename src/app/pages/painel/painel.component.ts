import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CurriculosService } from 'src/app/services/curriculos.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss'],
})
export class PainelComponent implements OnInit {

  userCurriculos = [];

  constructor(
    public authService: AuthService,
    public curriculosService: CurriculosService
  ) {
    this.curriculosService.curriculoList?.subscribe((userCurriculos) => {
      console.log({ userCurriculos });
      this.userCurriculos = userCurriculos?.curriculos;
    });
  }

  ngOnInit(): void {}
}
