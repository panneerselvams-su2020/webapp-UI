import { Component, OnInit } from '@angular/core';
import { Iuser, IBook, Iimage } from 'src/app/interface/IResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { timeStamp } from 'console';

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
  expan: boolean = false;
  switch: boolean = false;
  fileUpload = [];
  image : any;
  imag:any;
  rowImages : any = [];
  uploads: boolean = false;


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
    this.rightBtn = "View Images"

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
    if(this.rightBtn == "View Images" && x == "right"){
      this.getImages();
    }
    if(this.leftBtn == "back" && x == "left"){
      this.backtoUpdate();
    }
  }

  backtoUpdate(){
    this.switch=false;
    this.rightBtn="View Images";
    this.leftBtn="Back";
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

  // method to get and display images
  getImages(){

    let body = {
      isbn:this.res.isbn,
      title:this.res.title,
      author:this.res.authors,
      pubDate:this.res.pubDate,
      bookQuantity:this.res.bookQuantity,
      price:this.res.price
    }

    this.appservice.post('US-VI',body).subscribe((i:any)=>{
      if(i!=null){
        this.image=i;
        this.leftBtn = "back";
        this.rightBtn="";
        if(this.image.length == 0){
          this.switch = true;
          alert("No images to display! Please add one")
          return;
        }
        else{
        this.switch=true;
        this.rowImages=[];
    
        let rows = Math.floor((this.image.length / 3));
        let remainder = this.image.length % 3;
        if(remainder > 0){
          rows = rows + 1;
        }
        let k = 0;
        for(let i = 1; i <= rows; i++){
          let data = [];
          for(let j =1; j<= 3; j++){
            let col = {
              image : this.image[k]?.image,
              name : this.image[k]?.name
            }
            data.push(col)
            k++;
          }
          this.rowImages.push(data);
        }
      } 

      }else{
        alert("Error Occured,Please try again")
      }
    })

    
    }
  

// method to expand the image on click
  expand(x: any) {
    this.expan = true;
    this.imag = x;
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }


deleteImage(x){
  let a = confirm("Are you sure you want to delete the image? This action cannot be undone")
  let body = {
    name: x.name
  }
if(a==true){
  this.appservice.put<Iimage>('US-DI', body).subscribe((res: any) => {
    if(res!=null){
      console.log(res);
     alert("Image deleted Successfully")
     this.getImages();
     return;
    }
    else
    alert("Error Occured! Please try again");
    });
  }

}
  // method to close the wimage wndow
close(){
  this.rightBtn = "";
  this.router.navigate(['/home/sell']);
  return;
}

onUploadClicked(x){
  for(let i = 0; i < x.length; i++){
   if(x[i].type == "image/png" || x[i].type == "image/jpg" || x[i].type == "image/jpeg"  ){
     let reader = new FileReader();
     reader.readAsDataURL(x[i]);
     reader.onload= () =>{
      let u = reader.result as string;
      this.fileUpload.push(u);
     }
   }else{
     this.uploads = true;
   }
  }
 }

 addMoreImages(){
  let body={
    book:{
      isbn:this.res.isbn,
      title:this.res.title,
      author:this.res.authors,
      pubDate:this.res.pubDate,
      bookQuantity:this.res.bookQuantity,
      price:this.res.price,
      userName:this.user.userName
  },
    image:this.fileUpload
  }
  
  console.log(body)

  
    this.appservice.put<IBook>('US-UI', body).subscribe(y => {
      //this.userService.reloadUser(y);
      if(y!=null){
      alert("Image/s added successfully");
      this.fileUpload=[];
      this.getImages();
      }
      else{
        alert("Either the image already exists or some issue occured! Please try again" )
      }
      this.getImages();
    });
  
 }

 // method to close image with the close image
spanClick(){
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// // method to close the wimage wndow
// close(){
//     this.rightBtn = "";
//     this.router.navigate(['/home/sell']);
//     return;
//   }


}

