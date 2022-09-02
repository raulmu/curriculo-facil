import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RegistropageComponent } from './registropage/registropage.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'registro', component: RegistropageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
