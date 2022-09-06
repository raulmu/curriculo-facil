import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailLoginComponent } from './pages/email-login/email-login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistropageComponent } from './pages/registropage/registropage.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistropageComponent },
  { path: 'perfil', component: PerfilComponent},
  { path: 'email-login', component: EmailLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
