import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppServiceService } from '../../app-service.service';
//import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  opened: boolean = false;
  Nav:any[];
  public blobUrl;
  public showOverlay = true;
  messageSuccess: boolean;

  constructor(private _routes: Router, private Appservice : AppServiceService) { 
        
  }
  
  ngOnInit(): void {
    //navicons for user
      this.Nav = [{displayName : 'Buy Books', route : 'buy', data : 'user'},
      {displayName : 'Sell Books', route : 'sell', data : 'user'},
      {displayName : 'Cart', route : 'cart', data : 'user'},
      {displayName : 'Profile', route : 'profile', data : 'user'},
    {displayName : 'Logout', route : 'logout'}];

    }
     
  
 //get url of the application while navigating
  getURL(param : any):void{
    this.opened = ! this.opened;
    if(param.route == "logout"){
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('auth');
      this._routes.navigate(['/login']);
    }else{
      this._routes.navigate(["/layout/" + param.route]);
    }
  }
  

  }

