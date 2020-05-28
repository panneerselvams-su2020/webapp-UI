import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
  export class LoginguardService {
  
    constructor(private router: Router) { }
    canActivate() {
      let t = localStorage.getItem("jwt_token")
      if (t != null) {
        this.router.navigate(['/layout/profile'])
        return false;
      } else {
        return true;
      }
    }
  }