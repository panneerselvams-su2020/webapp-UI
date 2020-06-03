import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProfileComponent } from './profile/profile.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { CartComponent } from './cart/cart.component';
import { BookUpdateComponent } from './book-update/book-update.component';



// adding all the routing for routing to the components
const routes: Routes = [
    {
      path:'',
      component:LayoutComponent,
      children:[
        {path: 'profile', component: ProfileComponent},
        {path: 'buy', component: BuyComponent},
        {path: 'sell', component: SellComponent},
        {path: 'cart', component: CartComponent},
        {path: 'bookUpdate', component: BookUpdateComponent}
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