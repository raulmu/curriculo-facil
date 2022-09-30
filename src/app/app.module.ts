import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import {
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME,
  LyCommonModule
} from '@alyle/ui';
import { MinimaLight } from '@alyle/ui/themes/minima';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { EmailLoginComponent } from './pages/email-login/email-login.component';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';

registerLocaleData(localePt, 'pt', localePtExtra);

import { AuthService } from './services/auth.service';
import { PainelComponent } from './pages/painel/painel.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { VerificarEmailComponent } from './pages/verificar-email/verificar-email.component';
import { FormularioCurriculoComponent } from './pages/formulario-curriculo/formulario-curriculo.component';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter,
} from '@angular/material/core';
import { AdicionaisComponent } from './pages/adicionais/adicionais.component';
import { ExcluirPerfilComponent } from './pages/excluir-perfil/excluir-perfil.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CustomDatePickerAdapter, CUSTOM_DATE_FORMATS } from './shared/date-adapter';
import { UploadFotoComponent } from './pages/upload-foto/upload-foto.component';
import { LySliderModule } from '@alyle/ui/slider';
import { PdfPreviewComponent } from './pages/pdf-preview/pdf-preview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    EmailLoginComponent,
    PainelComponent,
    EsqueceuSenhaComponent,
    VerificarEmailComponent,
    FormularioCurriculoComponent,
    AdicionaisComponent,
    ExcluirPerfilComponent,
    ConfirmDialogComponent,
    UploadFotoComponent,
    PdfPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    HttpClientModule,
    MatSnackBarModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    LyImageCropperModule,
    LySliderModule,
    LyCommonModule,
    PdfViewerModule
  ],
  providers: [
    AuthService,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    {provide: DateAdapter, useClass: CustomDatePickerAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    [ LyTheme2 ],
    [ StyleRenderer ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// https://www.positronx.io/full-angular-firebase-authentication-system/
