import { Timestamp } from 'rxjs';

export interface IResponse{
    token: any;
    user: Iuser;
}

export interface Iuser{
    firstName: String;
    lastName: String;
    userName : String;
    userPassword: String;
}



export interface userResponse{
    userName: String;
    oldPassword: String;
    newPassword: String;
}

export interface IBook{
    author: String;
    title: String;
    bookQuantity: Number;
    isbn: String;
    price: Number;
    pubDate: Date;
    createdTime: Date;
    updatedTime: Date;
    isDeleted: boolean;
}

export interface ICart{
    book: object;
    userName: String;
    cartQuantity:Number;
}

export interface Iimage{
    image: String,
   name: String
}

