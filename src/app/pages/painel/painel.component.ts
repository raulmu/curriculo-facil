import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ConfirmDialogModel } from 'src/app/components/confirm-dialog/confirm-dialog-model';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
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
export class PainelComponent implements OnInit, OnDestroy {
  curriculoList: CurriculoList | undefined;
  subs = new Subscription();
  constructor(
    public authService: AuthService,
    public curriculosService: CurriculosService,
    public nav: NavigateService,
    private progressBarService: ProgressBarService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.subs.add(
      this.curriculosService.curriculoList?.subscribe((userCurriculos) => {
        //console.log('PainelComponentCOnstructor', userCurriculos);
        this.curriculoList = userCurriculos;
      })
    );
  }

  get userCurriculos(): Curriculo[] {
    return this.curriculoList ? this.curriculoList.curriculos : [];
  }

  addCurriculo() {
    if (this.userCurriculos.length) this.nav.navigateTo('adicionais');
    else this.nav.navigateTo('curriculo');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  deleteCurriculo(uid: string) {
    this.progressBarService.show.next(true);
    this.curriculosService
      .deleteCurriculoFromList(uid, this.curriculoList!)
      .then((_) => {
        this.progressBarService.show.next(false);
        this._snackBar.open('Removido', 'Ok', { duration: 15 });
      })
      .catch((err) => {
        this._snackBar.open('Não removido', 'Ok', { duration: 15 });
        console.log({ err });
        this.progressBarService.show.next(false);
      });
  }

  confirmarExclusao(uid: string): void {
    const message = `Esta exclusão não poderá ser revertida`;
    const dialogData = new ConfirmDialogModel(
      'Confirmar Exclusão do Currículo',
      message
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '320px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) this.deleteCurriculo(uid);
    });
  }
}
