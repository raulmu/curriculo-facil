import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistropageComponent } from './pages/registropage/registropage.component';
import { EmailLoginComponent } from './pages/email-login/email-login.component';

import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    RegistropageComponent,
    PerfilComponent,
    EmailLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    AuthService
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }

// https://www.positronx.io/full-angular-firebase-authentication-system/
