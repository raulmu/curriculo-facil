import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailLoginComponent } from './pages/email-login/email-login.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { PainelComponent } from './pages/painel/painel.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerificarEmailComponent } from './pages/verificar-email/verificar-email.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent},
  { path: 'email-login', component: EmailLoginComponent},
  { path: 'painel', component: PainelComponent },
  { path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
  { path: 'verificar-email', component: VerificarEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
