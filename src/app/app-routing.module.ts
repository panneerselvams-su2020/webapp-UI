import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutModule } from './layout/layout.module';
import { AuthService } from 'src/auth-guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'layout', loadChildren: () => LayoutModule, canActivate: [AuthService]},
  {path: 'signUp', component: LoginComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
