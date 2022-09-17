import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Curriculo } from 'src/app/services/curriculo';
import { CurriculoList } from 'src/app/services/curriculoList';
import { CurriculosService } from 'src/app/services/curriculos.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss'],
})
export class PainelComponent implements OnInit {
  curriculoList: CurriculoList | undefined;

  constructor(
    public authService: AuthService,
    public curriculosService: CurriculosService,
    private _nav: NavigateService,
    private progressBarService: ProgressBarService,
    private _snackBar: MatSnackBar
  ) {
    this.curriculosService.curriculoList?.subscribe((userCurriculos) => {
      this.curriculoList = userCurriculos;
    });
  }

  get userCurriculos(): Curriculo[] {
    return this.curriculoList ? this.curriculoList.curriculos : [];
  }

  addCurriculo() {
    if (this.userCurriculos.length) this._nav.navigateTo('adicionais');
    else this._nav.navigateTo('curriculo');
  }

  ngOnInit(): void {}

  deleteCurriculo(uid: string) {
    this.progressBarService.show.next(true);
    this.curriculosService
      .deleteCurriculoFromList(uid, this.curriculoList!)
      .then((_) => {
        this.progressBarService.show.next(false);
        this._snackBar.open('Removido', 'Ok', {duration: 15});
      })
      .catch((err) => {
        this._snackBar.open('Não removido', 'Ok', {duration: 15});
        console.log({err});
        this.progressBarService.show.next(false);
      });
  }
}
