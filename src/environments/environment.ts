// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  "api_url":"http://localhost:8080/",
  "services":[
    //UserAuthentication
    {code:"US-AUT",url:"authenticate"},
    {code:"US-SIGN",url:"signup"},
    //update
    {code:"US-UPD",url:"update"},
    //update User Password
  {code:"US-UUPD",url:"updatePassword"},
  //add a Book
{code:"US-AB", url:"addBook"},
{code:"US-UB", url:"updateBook"},
{code:"US-DB", url:"deleteBook"},

//get list of seller book
{code:"US-GS", url:"getSellerBooks"},
{code:"US-GB", url:"getBuyerBooks"},

//add to Cart
{code:"US-ATC", url:"addToCart"},
{code:"US-UC", url:"updateCart"},
{code:"US-VC", url:"viewCart"},
{code:"US-RFC", urk:"removeFromCart"}

]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
