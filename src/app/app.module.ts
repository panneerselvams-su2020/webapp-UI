import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './material-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
//import { AppServiceService, APIInterceptorService } from './app-service.service';
// for the service to be available across the project
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APIInterceptorService, AppServiceService } from './app-service.service';
import { EncryptServiceService } from './encrypt-service.service';
import { UserServiceService } from './user-service.service';
import { LoginComponent } from './login/login.component';
//import {EncryptServiceService} from '../app/encrypt-service.service';
//import { UserServiceService } from './shared/user-service.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
   // NgModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
    

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: APIInterceptorService, multi: true },
    AppServiceService, EncryptServiceService, UserServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
