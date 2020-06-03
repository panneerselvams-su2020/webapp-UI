import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Iuser, IBook, ICart } from 'src/app/interface/IResponse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { element } from 'protractor';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  title: string = "Cart";
  leftBtn: String;
  rightBtn: String="Buy More";
  user: Iuser;
  cart:ICart;
  createForm: FormGroup;
  displayedColumns: string[] = ['id','isbn','title','author','price','bookQuantity','details','removeFromCart','status'];
  data: ICart[] = [];
  dataSource: MatTableDataSource<ICart>;  
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
      
       this.appservice.get<ICart>('US-VC').subscribe((y: any[])=>{
         if(y!=null){
         this.data = [];
         y.forEach(i=>{
           this.data.push(i);
         })
         console.log(this.data)
         this.dataSource = new MatTableDataSource(this.data);
         this.dataSource.paginator = this.paginator;  
         this.dataSource.sort = this.sort;  
         }else{
           alert ("There was some issue!Please try again");
         }
       });

       console.log()

  }

  editQuantity=(element:ICart)=>{
    let cart= prompt("Enter new quantity");
    if (cart.match('^[0-9]+$')){
    let parseCart = parseInt(cart);
    if(Number.isNaN(parseCart) || parseCart<=0 ){
      alert("Please provide a valid input");
      this.editQuantity(element);

    }else if(element.book['bookQuantity'] < parseCart){
      alert("The quantity you entered is not available. Please provide a lesser quantity");
      this.editQuantity(element);
    }else{

    let body={  
      cartQuantity: parseCart,
      userName: this.user.userName,
      book: element.book
    }
    

    this.appservice.put<ICart>('US-UC',body).subscribe((y: any[])=>{
      if(y==null){
        alert("Updated failed!Please check your input and try again!");
      }else{
        this.appservice.get<ICart>('US-VC').subscribe((y: any[])=>{
          if(y!=null){
          this.data = [];
          y.forEach(i=>{
            this.data.push(i);
          })
          console.log(this.data)
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;  
          this.dataSource.sort = this.sort;
          this.title="Cart";
          this.rightBtn="Buy More"
          }else{
            alert ("There was some issue!Please try again");
          }
        });
        alert("Quantity in Cart updated Successfully")
      }
    });
  }
}else{
  alert("Please provide a valid input");
  this.editQuantity(element);

}
  }

  removeCart=(element:ICart)=>{
    this.delete = confirm("Proceed to delete? This action cannot be undone");
    if(this.delete==true){
      let body={
        cartQuantity: element.cartQuantity,
        userName: this.user.userName,
        book: element.book
      }
       
      this.appservice.put<ICart>('US-RFC',body).subscribe(y=>{
        
        this.appservice.get<ICart>('US-VC').subscribe((y: any[])=>{
          if(y!=null){
          this.data = [];
          y.forEach(i=>{
            this.data.push(i);
          })
          console.log(this.data)
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;  
          this.dataSource.sort = this.sort;  
          }else{
            alert ("There was some issue!Please try again");
          }
        });
        alert("Removed from Cart Successfully")
      })
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

    if (this.rightBtn == "Buy More" && x == "right") {
      this.buy();
    }
  }

  buy(){
    this.router.navigate(['/layout/buy']);
  }

}
