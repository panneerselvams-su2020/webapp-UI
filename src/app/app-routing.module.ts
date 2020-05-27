import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutModule } from './layout/layout.module';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'layout', loadChildren: () => LayoutModule},
  {path: 'signUp', component: LoginComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
