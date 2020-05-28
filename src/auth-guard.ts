import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  canActivate() {
    let t = localStorage.getItem("jwt_token")
    if (t != null) {
      return true;
    } else {
      this.router.navigate(['/login'])
      return false;
    }
  }
}