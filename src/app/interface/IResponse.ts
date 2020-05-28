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

