import { Component, OnInit } from '@angular/core';
import { Iuser, IBook } from 'src/app/interface/IResponse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppServiceService } from 'src/app-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buyerimage',
  templateUrl: './buyerimage.component.html',
  styleUrls: ['./buyerimage.component.scss']
})
export class BuyerimageComponent implements OnInit {

  title: string = "Images of the selected book from all Sellers";
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
      this.getImages();
    }

  ngOnInit(): void {
   
  }

  outputemitted(x: string) {
    if (this.leftBtn == "Back" && x == "left") {
      this.back();
      return;
    }
  
  }

  getImages() {
    let body = {
      isbn:this.res.isbn,
      title:this.res.title,
      author:this.res.authors,
      pubDate:this.res.pubDate,
      bookQuantity:this.res.bookQuantity,
      price:this.res.price,
      userName:this.res.userName
    }

    this.appservice.post('US-VIB',body).subscribe((i:any)=>{
      if(i!=null){
        this.image=i;
        this.leftBtn = "Back";
        this.rightBtn="";
        if(this.image.length == 0){
          this.switch = true;
          alert("No images to display!");
          this.router.navigate(['/layout/buy']);
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
  back() {
    this.router.navigate(['/layout/buy']);
  }

  close(){
    this.rightBtn = "";
    this.router.navigate(['/layout/buy']);
    return;
  }

  spanClick(){
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
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

}
