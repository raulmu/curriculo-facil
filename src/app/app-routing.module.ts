import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { NoAuthGuard } from './guard/no-auth.guard';
import { EmailLoginComponent } from './pages/email-login/email-login.component';
import { EsqueceuSenhaComponent } from './pages/esqueceu-senha/esqueceu-senha.component';
import { FormularioCurriculoComponent } from './pages/formulario-curriculo/formulario-curriculo.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { PainelComponent } from './pages/painel/painel.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { VerificarEmailComponent } from './pages/verificar-email/verificar-email.component';

const routes: Routes = [
  { path: '', component: InicioComponent},
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
  { path: 'cadastro', component: RegistroComponent, canActivate: [NoAuthGuard]},
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  { path: 'email-login', component: EmailLoginComponent, canActivate: [NoAuthGuard]},
  { path: 'painel', component: PainelComponent, canActivate: [AuthGuard] },
  { path: 'esqueceu-senha', component: EsqueceuSenhaComponent, canActivate: [NoAuthGuard]},
  { path: 'verificar-email', component: VerificarEmailComponent, canActivate: [AuthGuard]},
  { path: 'curriculo', component: FormularioCurriculoComponent, canActivate: [AuthGuard]},
  { path: 'curriculo/:id', component: FormularioCurriculoComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
