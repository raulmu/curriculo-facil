import { Component, OnInit } from '@angular/core';
import { Vaga } from 'src/app/models/vaga.model';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { VagasService } from 'src/app/services/vagas.service';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
  styleUrls: ['./vagas.component.scss'],
})
export class VagasComponent implements OnInit {
  userUid: string = '';

  vagas: Vaga[] = [];

  constructor(private vagasService: VagasService, public nav: NavigateService, private authService: AuthService) {
    this.userUid = authService.userData ? authService.userData.uid : '';
  }

  ngOnInit(): void {
    this.vagasService.vagas$.subscribe((vagas) => {
      this.vagas = vagas;
    });
  }
}
