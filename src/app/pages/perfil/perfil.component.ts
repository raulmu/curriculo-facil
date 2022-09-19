import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from 'src/app/components/confirm-dialog/confirm-dialog-model';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { NavigateService } from 'src/app/services/navigate.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  constructor(public authService: AuthService,
    private dialog: MatDialog, private _nav: NavigateService) {}

  ngOnInit(): void {}

  excluirPerfil() {
    this.authService.deleteUser();
  }

  confirmarExclusao(): void {
    const message = `Esta exclusão não poderá ser revertida`;
    const dialogData = new ConfirmDialogModel(
      'Confirmar Exclusão do seu Perfil',
      message
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '320px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this._nav.navigateTo('/excluir-perfil');
      }
    });
  }
}
