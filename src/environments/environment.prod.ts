export const environment = {
  production: true,
  "api_url": "http://prod.sridharprasadpanneerselvam.me:8080/",
  "services":[
    //UserAuthentication
    {code:"US-AUT",url:"authenticate"},
    {code:"US-SIGN",url:"signup"},
    {code:"US-RES",url:"resetPassword"},
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
{code:"US-RFC", url:"removeFromCart"}

]
};
