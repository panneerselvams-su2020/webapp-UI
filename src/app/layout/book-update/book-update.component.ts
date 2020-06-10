import { Component, OnInit } from '@angular/core';
import { Iuser, IBook } from 'src/app/interface/IResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.scss']
})
export class BookUpdateComponent implements OnInit {

  title: string = "Update Book";
  leftBtn: String = "Back";
  rightBtn: String="";
  res: any;
  user: Iuser;
  book : IBook;
  updateForm: FormGroup; 


  constructor(private fb: FormBuilder,
    private appservice: AppServiceService,
    public dialog: MatDialog, private router: Router) { 

      this.user=JSON.parse(localStorage.getItem("auth"));
      this.res= this.router.getCurrentNavigation().extras.state.rowData;

      this.updateForm = this.fb.group({
        isbn: [this.res.isbn, [Validators.required,Validators.minLength(13),Validators.maxLength(13)]],
        title: [this.res.title, [Validators.required]],
        author: [this.res.author, [Validators.required,Validators.pattern('.*[a-zA-Z]+.*')]],
        pubDate: [this.res.pubDate, [Validators.required]],
        bookQuantity: [this.res.bookQuantity, [Validators.required,Validators.min(0),Validators.max(999),Validators.pattern('^[0-9]+$')]],
        price: [this.res.price, [Validators.required,Validators.min(0.01),Validators.max(9999.99),Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]]
      });

    }

  ngOnInit(): void {
  }


  back(){
    this.router.navigate(['/layout/sell']);
  }

  updateBook(){
    let body={
      title: this.updateForm.get('title').value,
      isbn: this.updateForm.get('isbn').value,
      author:this.updateForm.get('author').value,
      pubDate:this.updateForm.get('pubDate').value,
      bookQuantity:this.updateForm.get('bookQuantity').value,
      price:this.updateForm.get('price').value,
      userName:this.user.userName

    }

    if(this.updateForm.valid){
      this.appservice.put<IBook>('US-UB',body).subscribe(res =>{
        if(res!=null){
          alert('Update Book Successfull');
          this.router.navigate(['/layout/sell']);
        }
        else{
          alert('Some error occured! Please try again');
        }


      })
    }
  }

  outputemitted(x: string) {

    
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
      return;
    }
  }


  get rf() { 
    return this.updateForm.controls; 
  }

  getUpdateErrorMessage(x: any) {
    switch (x) {
      case "isbn":
        if (this.updateForm.get('isbn').hasError('required')) {
          return 'Please provide a valid input';
        }else
        if(this.updateForm.get('isbn').hasError('minLength')){
          return this.updateForm.get('isbn').hasError('minLength') ? 'ISBN should contain only 13 characters' : '';
        }else
        if(this.updateForm.get('isbn').hasError('maxLength')){
          return this.updateForm.get('isbn').hasError('maxLength') ? 'ISBN should contain only 13 characters' : '';
        }
        break;
      case "title":
        if (this.updateForm.get('title').hasError('required')) {
          return 'Please provide a valid input';
        }
      case "author":
        if (this.updateForm.get('author').hasError('required')) {
          return 'You must enter a value! If there are multiple authors, Please use a comma inbetween each author';
        }else
        if(this.updateForm.get('author').hasError('pattern')){
          return 'Input should contain atleast one alphabet'
        }
        break;
      case "pubDate":
        if (this.updateForm.get('pubDate').hasError('required')) {
          return 'Please provide a date';
        }
        break;
      case "bookQuantity":
          if (this.updateForm.get('bookQuantity').hasError('min')) {
            return 'Quantity must be greater than 0';
          } else
          if (this.updateForm.get('quantity').hasError('max')) {
            return 'Quantity must be lesser than 999';
          }else
          if(this.updateForm.get('bookQuantity').hasError('pattern')){
            return 'Please enter only in integers';
          }
          break;
      case "price":
          if (this.updateForm.get('price').hasError('min')) {
            return 'Price must be greater than 0.01';
          } else
          if (this.updateForm.get('quantity').hasError('max')) {
            return 'Price must be lesser than 9999.99';
          }else if(this.updateForm.get('price').hasError('pattern')){
            return 'Please provide correct input in price format';
          }
          break;

    }
  }

}