import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from '../material-module';
import { LayoutRoutingModule } from './layout.routing';
//import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppServiceService} from '../../app-service.service';
//import {AgmCoreModule} from '@agm/core';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';


// importing all the required modules for the application

@NgModule({

  declarations: [LayoutComponent, ProfileComponent, NavbarComponent],

  imports: [
    CommonModule, MaterialModule,LayoutRoutingModule,ReactiveFormsModule,
    FlexLayoutModule.withConfig({useColumnBasisZero: false}), HttpClientModule,FormsModule
  ],
  providers: [AppServiceService]
})
export class LayoutModule { }
