import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { IResponse, Iuser } from '../interface/IResponse';
import { FormBuilder, FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';
import { EncryptServiceService } from '../../app/encrypt-service.service';
//import { UserServiceService } from '../user-service.service';
//import { userResponse } from '../interface/IResponse'
import { MustMatch } from '../../app/helpers/must-match.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  view: any;
  registerForm:FormGroup;
  passwordResetForm:FormGroup;
  verificationForm:FormGroup;
  submitted:boolean;
  mail: String;
  radioFilter:String;
  //passwordPattern: string | RegExp;

  constructor(private _routes: Router,
    private route: ActivatedRoute,
    private appservice: AppServiceService,
    private EncrDecr: EncryptServiceService,
    private formBuilder: FormBuilder
    ) { }

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth');
    this.urlReader();
    this.submitted=false;
  
    this.registerForm = this.formBuilder.group({
    userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
    firstName: ['', [Validators.required,Validators.pattern('.*[a-zA-Z]+.*')]],
    lastName: ['', [Validators.required,Validators.pattern('.*[a-zA-Z]+.*')]],
    userPassword: ['', [Validators.required, Validators.minLength(8),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
    confirmPassword: ['', Validators.required]
    }, {
    validator: MustMatch('userPassword', 'confirmPassword')
    });
  
    this. passwordResetForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]]
    });
  }

  //Authenticate Function For JWT Login
  authenticate() {
    
    
    let body = {
      username:this.loginForm.get('userName').value,
      password: btoa(this.loginForm.get('userPassword').value)
    }
    // authenticate the user and let him login
    if(this.loginForm.valid){
    const val = this.appservice.post<IResponse>('US-AUT', body).subscribe(x => {
      if (x != null) {
        localStorage.setItem("auth", JSON.stringify(x.user));
        localStorage.setItem("jwt_token",x.jwt.token);
        this._routes.navigate(['/layout/profile'])
      } else {
        alert ("Email or Password is invalid, Please try again");

        };
    });
  }
}

forgotPassword(){
  this._routes.navigate(['/passwordReset']);
  };

 changePassword(){
  let body = {
    username:this.passwordResetForm.get('userName').value
  }
  if(this.passwordResetForm.valid){
    this.appservice.post<Iuser>('US-RES', body).subscribe(y => {
      if(y!=null){
      alert("Password Reset link has been sent to your mailId. Please check!");
      this._routes.navigate(['/login']); 
    }
      else{
        alert("Error occured!Please try again later!")
      }}
    )}
     else{
      alert("Error occured!Please check the entered inputs!");
  }
 }
  //Form Controls Retrieving Function
  get rf() { return this.registerForm.controls; }
  
  get lf() { return this.loginForm.controls;}
  
  //View Retriever
  urlReader() {
    this.route.url.subscribe(params => {
      this.view=params[0].path;

    })
  }

  signUp(){
    this._routes.navigate(['/signUp']);
  }

  login(){
    this._routes.navigate(['/login']);
  }

 

  //Register Function
  register(){
    this.submitted = true;
    let body = {
      userName: this.registerForm.get('userName').value,
      userPassword: btoa(this.registerForm.get('userPassword').value),
      firstName: this.registerForm.get('firstName').value,
      lastName: this.registerForm.get('lastName').value
    };



    // Register Body Post
    if(this.registerForm.valid){
        this.appservice.post<Iuser>('US-SIGN', body).subscribe(y => {
          if(y!=null){
          alert("SignUp successfull!,Please login now");
          this._routes.navigate(['/login']); 
        }
          else{
            alert("User already exists! Please signin instead!")
          }}
        )}
         else{
          alert("Invalid Signup!Please check the entered inputs!");
        }}





//Error Message Retrieval For Register
getRegisterErrorMessage(x: any) {
  switch(x) {
    case "firstName":
      if (this.registerForm.get('firstName').hasError('required')) {
        return 'You must enter a value';
      }else
      if(this.registerForm.get('firstName').hasError('pattern')){
        return 'Input should contain atleast one alphabet';
      }
      break;
    case "userName":
      if (this.registerForm.get('userName').hasError('required')) {
        return 'You must enter a value';
      } else if (this.registerForm.get('userName').hasError('pattern')){
        return this.registerForm.get('userName').hasError('pattern') ? 'Not a valid email' : '';
      }
      break;
    case "lastName":
      if (this.registerForm.get('lastName').hasError('required')) {
        return 'You must enter a value';
      }else
      if(this.registerForm.get('lastName').hasError('pattern')){
        return 'Input should contain atleast one alphabet';
      }
      break;
    case "userPassword":
      if (this.registerForm.get('userPassword').hasError('required')) {
        return 'You must enter a value';
      } else
      if (this.registerForm.get('userPassword').hasError('minlength')){
        return this.registerForm.get('userPassword').hasError('minlength') ? 'Password short (8 or more characters)' : '';
      }else
      if(this.registerForm.get('userPassword').hasError('pattern')){
        return 'Please enforce a strong Password, 1 UpperCase/1 LowerCase/1 SpecialCharacter/1 Number/1 ';
      }
      break;
    case "confirmPassword":
      if (this.registerForm.get('confirmPassword').hasError('required')) {
        return 'You must enter a value';
      } else
      if (this.registerForm.get('confirmPassword').hasError('mustMatch')){
        return this.registerForm.get('confirmPassword').hasError('mustMatch') ? 'Passwords don\'t match' : '';
      }
      break;
    }
  }


  //Error Message Retrieval For Login
  getLoginErrorMessage(x: any) {
    switch(x) {
      case "userName":
        if (this.loginForm.get('userName').hasError('required')) {
          return 'You must enter a value';
        } else if (this.loginForm.get('userName').hasError('email')){
          return this.loginForm.get('userName').hasError('email') ? 'Not a valid email' : '';
        }
        break;
      case "userPassword":
        if (this.loginForm.get('userPassword').hasError('required')) {
          return 'You must enter a value';
        } else if (this.loginForm.get('userPassword').hasError('pattern')){
          return 'Password must contain atleast one number, one special character, one uppercase and one lowercase';
        }
        break;
      }
      
    }

  //Error Message For password reset 

  getResetPasswordErrorMessage(x: any) {
    switch(x) {
      case "userName":
        if (this.passwordResetForm.get('userName').hasError('required')) {
          return 'You must enter a value';
        } else if (this.passwordResetForm.get('userName').hasError('email')){
          return this.passwordResetForm.get('userName').hasError('email') ? 'Not a valid email' : '';
        }
        break;
      }
      
    }

}










