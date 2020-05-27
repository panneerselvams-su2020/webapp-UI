import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProfileComponent } from './profile/profile.component';



// adding all the routing for routing to the components
const routes: Routes = [
    {
      path:'',
      component:LayoutComponent,
      children:[
        {path: 'profile', component: ProfileComponent}
      ],
    },
 ];

 @NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })

export class LayoutRoutingModule { }