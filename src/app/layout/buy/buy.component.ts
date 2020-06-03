import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Iuser, IBook, ICart } from 'src/app/interface/IResponse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit {


  title: string = "Buyer Products";
  leftBtn: String;
  rightBtn: String="View Cart";
  switch: boolean = false;
  btnDisabled: boolean = false;
  user: Iuser;
  book : IBook;
  createForm: FormGroup;
  displayedColumns: string[] = ['id','isbn','title','author','price','pubDate','status','addToCart'];
  data: IBook[] = [];
  dataSource: MatTableDataSource<IBook>;  
  delete:boolean;

  constructor(private fb: FormBuilder,
    private appservice: AppServiceService,
    public dialog: MatDialog, private router: Router) { 
      this.user=JSON.parse(localStorage.getItem("auth"));
      
    }
    @Input()
    pageIndex: number
  
    @Output()
    page: EventEmitter<PageEvent>
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.pageIndex = 1;
      let body=[]
       this.appservice.get<IBook>('US-GB').subscribe((y: any[])=>{
         if(y!=null){
         this.data = y;
         this.dataSource = new MatTableDataSource(this.data);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;  
         //  console.log(this.data);
         }else{
           alert ("There was some issue!Please try again");
         }
       }); 
  }

  addToCart= (element:IBook) =>{

    let cart= prompt("Quantity you wish to order");
    if (cart.match('^[0-9]+$')){
      let parseCart = parseInt(cart);
      if(Number.isNaN(parseCart) || parseCart<=0 ){
        alert("Please provide a valid input");
        this.addToCart(element);
      }else if(element.bookQuantity< parseCart){
          alert("The quantity you entered is not available. Please provide a lesser quantity");
          this.addToCart(element);
        }else{
    
        let body={  
          cartQuantity: parseCart,
          user: this.user.userName,
          book: element
        }
    
    
        this.appservice.post<ICart>('US-ATC',body).subscribe((y: any[])=>{
          if(y==null){
            alert("Book is already present in cart, Please update instead");
          }else{
            alert("Book added to Cart Successfully")
          }
        })
      }
    
  
      }
    
    else {
      alert("Please enter a valid input");
      this.addToCart(element);
    }
    
  }

  loadPage(event){
    if(event.previouspageIndex>event.pageIndex){
      this.pageIndex = event.pageIndex+1;
    }else{
      this.pageIndex = event.pageIndex+10;
    }
  }

  outputemitted(x: string) {

    if (this.rightBtn == "View Cart" && x == "right") {
      this.viewCart();
    }
  }

  viewCart(){
    this.router.navigate(['/layout/cart']);
  }
}
