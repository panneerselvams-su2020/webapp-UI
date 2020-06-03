import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Iuser, IBook, ICart } from 'src/app/interface/IResponse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  book : IBook;
  createForm: FormGroup;
  displayedColumns: string[] = ['id','isbn','title','author','price','bookQuantity','details','removeFromCart'];
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
