import { Component, OnInit, AfterViewInit, Inject, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validator, AbstractControl, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isBuffer } from 'util';
import { AppServiceService } from '../../app-service.service';
import { Iuser, userResponse } from 'src/app/interface/IResponse';
//import { UserServiceService } from 'src/app/user-service.service';
import { MustMatch } from '../../helpers/must-match.validator';
import { EncryptServiceService } from 'src/app/encrypt-service.service';
//import { userResponse } from 'src/app/interface/IResponse';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscriber, Subject } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  btnDisabled: boolean = true;
  title: string = "Update Profile";
  switch: boolean = false;
  rightBtn: string = "Update";
  leftBtn: string = "";
  updateForm: FormGroup;
  updatePasswordForm :FormGroup;
  user: any;


  constructor(private fb: FormBuilder,
    //private userService: UserServiceService,
    private appservice: AppServiceService,
    public dialog: MatDialog) {
        

      this.user=JSON.parse(localStorage.getItem("auth"));
    
    this.updateForm = this.fb.group({
      
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [this.user.userName]
    });

    this.updatePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8),Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });

  }




  ngOnInit(): void {

    //this.blobUrl = window.URL.createObjectURL(this.userImage);

    //User will not have to add address while Vendor needs to add address
    
      this.rightBtn = "Update Password";
      this.btnDisabled = false;
  

  }



  get rf() { 
    return this.updateForm.controls; 
  }

  get vf(){
    return this.updatePasswordForm.controls;
  }

  onClick(event) {
    this.btnDisabled = false;
  }

 

  //If the user has an address updated earlier, address form field will display the same, while a new vendor needs to add a new address if he/she has not
  updateUserPassword() {

    this.switch = true;
    this.btnDisabled=true;
    this.rightBtn = "";
    this.leftBtn = "Back";
    // let body = {
    //   userFirstName: this.updateForm.get('firstName').value,
    //   userLastName: this.updateForm.get('lastName').value
    // };

    // if (this.updatePasswordForm.valid) {
    //   this.appservice.put<Iuser>('US-UPD', body).subscribe(y => {
    //     //this.userService.reloadUser(y);

    //     alert("Details have been updated successfully")

    //   });
    //   this.btnDisabled = true;
    // }

  }

  passwordUpdate(){

    let body= {
      userName: this.user.userName,
      oldPassword:btoa(this.updatePasswordForm.get('oldPassword').value),
      newPassword:btoa(this.updatePasswordForm.get('newPassword').value)
    }

        if (this.updatePasswordForm.valid) {
      this.appservice.put<userResponse>('US-UUPD', body).subscribe(y => {
        //this.userService.reloadUser(y);
        if(y!=null){
        alert("Details have been updated successfully")
        }else{
          alert("Please check your old password!")
        }
      });
      this.btnDisabled = true;
    }
  }

  // updateUserPassword() {
  //   this.switch = true;
  //   this.rightBtn = "Submit";
  //   this.leftBtn = "Back";
  //   this.btnDisabled=true;
    
    

  // }

  back() {
    this.switch = false;
    this.leftBtn = "";
    this.rightBtn = "Update Password";
    this.btnDisabled=false;
  }

  //importing the details entered in the update form and storing it to the db
  updateUser() {
    let body = {
      firstName: this.updateForm.get('firstName').value,
      lastName: this.updateForm.get('lastName').value,
      userName:this.user.userName
    };

    if (this.updateForm.valid) {
      this.appservice.put<Iuser>('US-UPD', body).subscribe(y => {
        //this.userService.reloadUser(y);
        debugger;
        if(y!=null)
        alert("Details have been updated successfully")
         else{
           alert("Hi");
         }
      });
    }
  }
  //Error handling messages

  getUpdateErrorMessage(x: any) {
    switch (x) {
      case "firstName":
        if (this.updateForm.get('firstName').hasError('required')) {
          return 'You must enter a value';
        }
        else if (this.updateForm.get('firstName').hasError('minLength')) {
          return this.updateForm.get('firstName').hasError('minLength') ? 'First Name should be atleast of 3 characters' : '';
        }
        else if (this.updateForm.get('firstName').hasError('maxLength')) {
          return this.updateForm.get('firstName').hasError('maxLength') ? 'First Name can be only to a max of 30 characters' : '';
        }
      case "lastName":
        if (this.updateForm.get('lastName').hasError('required')) {
          return 'You must enter a value';
        }
        else if (this.updateForm.get('lastName').hasError('minLength')) {
          return this.updateForm.get('lastName').hasError('minLength') ? 'Last Name should be atleast of 3 characters' : '';
        }
        else if (this.updateForm.get('lastName').hasError('maxLength')) {
          return this.updateForm.get('lastName').hasError('maxLength') ? 'Last Name can be only to a max of 30 characters' : '';
        }
      case "newPassword":
        if (this.updatePasswordForm.get('newPassword').hasError('minlength')) {
          return this.updatePasswordForm.get('newPassword').hasError('minlength') ? 'Password short (8 or more characters)' : '';
        }else
        if(this.updatePasswordForm.get('newPassword').hasError('pattern')){
          return 'Please enforce a strong Password, 1 UpperCase/1 LowerCase/1 SpecialCharacter/1 Number/1 ';
        }
      case "confirmPassword":
        if (this.updatePasswordForm.get('confirmPassword').hasError('mustMatch')) {
          return this.updatePasswordForm.get('confirmPassword').hasError('mustMatch') ? 'Passwords don\'t match' : '';
        }
      case "oldPassword":
          if (this.updatePasswordForm.get('newPassword').hasError('minlength')) {
            return this.updatePasswordForm.get('newPassword').hasError('minlength') ? 'Password short (8 or more characters)' : '';
          } 

    }
  }

  //Right Button and Left Button output

  outputemitted(x: string) {
    if (this.rightBtn == "Update Password" && x == "right") {
      this.updateUserPassword();
    }
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
    }

  }

  }


