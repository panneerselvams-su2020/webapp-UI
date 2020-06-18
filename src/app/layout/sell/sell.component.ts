import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Iuser, IBook } from 'src/app/interface/IResponse';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { element } from 'protractor';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  title: string = "Books you Sell";
  leftBtn: String;
  rightBtn: String="Sell a Book";
  switch: boolean = false;
  btnDisabled: boolean = false;
  user: Iuser;
  book : IBook;
  createForm: FormGroup;
  displayedColumns: string[] = ['id','isbn','title','author','price','bookQuantity','pubDate','createdTime','updatedTime','details','delete'];
  data: IBook[] = [];
  dataSource: MatTableDataSource<IBook>;  
  delete:boolean;
  createdTime: Date;
  updatedTime: Date;
  uploads: boolean = false;
  expan: boolean = false;
  fileUpload = [];
  image : [];
  imag:any;
  



  constructor(private fb: FormBuilder,
    private appservice: AppServiceService,
    public dialog: MatDialog, private router: Router) {
      this.user=JSON.parse(localStorage.getItem("auth"));

      this.createForm = this.fb.group({
        isbn: ['', [Validators.required,Validators.minLength(13),Validators.maxLength(13),Validators.pattern('[0-9]*')]],
        title: ['', [Validators.required]],
        author: ['', [Validators.required,Validators.pattern('.*[a-zA-Z]+.*')]],
        pubDate: ['', [Validators.required]],
        bookQuantity: ['', [Validators.required,Validators.min(0),Validators.max(999),Validators.pattern('^[0-9]+$')]],
        price: ['', [Validators.required,Validators.min(0.01),Validators.max(9999.99),Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]]
      });

     }
   
     @Input()
     pageIndex: number
   
     @Output()
     page: EventEmitter<PageEvent>
   
     @ViewChild(MatPaginator) paginator: MatPaginator;
     @ViewChild(MatSort) sort: MatSort;
     @ViewChild('formDirective') private formDirective: NgForm;
      
     ngOnInit() {
      this.pageIndex = 1;
      
       this.appservice.get<IBook>('US-GS').subscribe((y: any[])=>{
         if(y!=null){
         this.data = y;
         this.dataSource = new MatTableDataSource(this.data);
         this.dataSource.paginator = this.paginator;  
         this.data.reverse();
         this.dataSource.sort = this.sort;  
         //  console.log(this.data);
         }else{
           alert ("There was some issue!Please try again");
         }
       }); 
     }
  

  addBook(){
    let body={
      book:{
        isbn:this.createForm.get('isbn').value,
        title:this.createForm.get('title').value,
        author:this.createForm.get('author').value,
        pubDate:this.createForm.get('pubDate').value,
        bookQuantity:this.createForm.get('bookQuantity').value,
        price:this.createForm.get('price').value,
        userName:this.user.userName
    },
      image:this.fileUpload
    }
    
    console.log(body)

    if (this.createForm.valid) {
      this.appservice.post<IBook>('US-AB', body).subscribe(y => {
        //this.userService.reloadUser(y);
        if(y!=null){
        alert("Details have been added successfully");
        this.formDirective.resetForm();

       // console.log(this.book.createdTime)
          this.appservice.get<IBook>('US-GS').subscribe(i =>{
            if(i!=null){
              this.switch=false;
              this.data = i;
              this.dataSource= new MatTableDataSource(this.data);
              this.dataSource.paginator= this.paginator;
              this.data.reverse();
              this.dataSource.sort = this.sort;
              this.rightBtn = "Sell a Book";
              this.leftBtn="";
             // this.createdTime=this.book.createdTime;
              //this.upadtedTime=this.book.updatedTime;
            }else{
              alert("Error occured!Please check and try again");
            }
          })
        }else{
          alert(" The entered ISBN is already been added ! Please update instead")
        }
      });
    }

  }   
   
  
  

  get rf() { 
    return this.createForm.controls; 
  }

  outputemitted(x: string) {

    if (this.rightBtn == "Sell a Book" && x == "right") {
      this.sell();
    }
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
    }
  }

  back(){
    this.switch=false;
    this.rightBtn="Sell a Book";
    this.leftBtn="";
  }

  sell(){
    this.switch = true;
    this.leftBtn= "Back";
    this.rightBtn="";
    this.title="Books you Sell"
  }

  getUpdateErrorMessage(x: any) {

    switch (x) {
      
      case "isbn":
        if (this.createForm.get('isbn').hasError('required')) {
          return 'Please provide a valid input. FYI- ISBN should contain 13 numbers only';
        }else
        if(this.createForm.get('isbn').hasError('minLength')){
          return this.createForm.get('isbn').hasError('minLength') ? 'ISBN should contain only 13 characters' : '';
        }else
        if(this.createForm.get('isbn').hasError('maxLength')){
          return this.createForm.get('isbn').hasError('maxLength') ? 'ISBN should contain only 13 characters' : '';
        }
        break; 
      case "title":
        if (this.createForm.get('title').hasError('required')) {
          return 'Please provide a valid input';
        }
        break;
      case "author":
        if (this.createForm.get('author').hasError('required')) {
          return 'You must enter a value atleast one alphabet! If there are multiple authors, Please use a comma inbetween each author';
        }else
        if(this.createForm.get('author').hasError('pattern')){
          return 'Input should contain atleast one alphabet';
        }
        break;
      case "pubDate":
        if (this.createForm.get('pubDate').hasError('required')) {
          return 'Please provide a date';
        }
        break;
      case "bookQuantity":
          if (this.createForm.get('bookQuantity').hasError('min')) {
            return 'Quantity must be greater than 0';
          } else
          if (this.createForm.get('bookQuantity').hasError('max')) {
            return 'Quantity must be lesser than 999';
          }else
          if(this.createForm.get('bookQuantity').hasError('pattern')){
            return 'Please enter only in integers';
          }
          break;
      case "price":
          if (this.createForm.get('price').hasError('min')) {
            return 'Price must be greater than 0.01';
          } else
          if (this.createForm.get('price').hasError('max')) {
            return 'Price must be lesser than 9999.99';
          }else if(this.createForm.get('price').hasError('pattern')){
            return 'Please provide correct input in price format';
          }
          break;

    }
  }


  loadPage(event){
    if(event.previouspageIndex>event.pageIndex){
      this.pageIndex = event.pageIndex+1;
    }else{
      this.pageIndex = event.pageIndex+10;
    }
  }


  updateBook= (element:object) =>{
    const nav: NavigationExtras = {state: { rowData : element}};
    this.router.navigate(['/layout/bookUpdate'],nav)
  }

  deleteBook= (element:IBook) =>{

    
    this.delete = confirm("Proceed to delete? This action cannot be undone");
    if(this.delete==true){
      let body={
      isbn:element.isbn,
      title:element.title,
      author:element.author,
      pubDate:element.pubDate,
      bookQuantity:element.bookQuantity,
      price:element.price,
      userName:this.user.userName
      }
       
      this.appservice.put<IBook>('US-DB',body).subscribe(y=>{
        
        this.appservice.get<IBook>('US-GS').subscribe(i =>{
          if(i!=null){
            this.switch=false;
            this.data = i;
            this.dataSource= new MatTableDataSource(this.data);
            this.dataSource.paginator= this.paginator;
            this.dataSource.sort = this.sort;
            this.rightBtn = "Sell a Book";
            this.leftBtn="";
            alert("Book delete successful");
          }else{
            alert("Error occured!Please check and try again");
          }
        })
      })
    }
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

   

}
