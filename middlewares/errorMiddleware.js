class ErrorHandler extends Error{

constructor(message , statusCode){
super(message);
this.statusCode = statusCode
}
} 

export const errorMiddleware = ( err ,  req ,resp , next)=>{

err.message = err.message || "INTERNAL SERVER ERRORS" 
err.statusCode = err.statusCode || 500

if(err.code === 11000){                                               // duplicate email IF ENTRED 
    const message = `Duplicate ${Object.keys(err.keyValue)}  ENTERED`;
    err = new ErrorHandler(message , 400);
}

if(err.name == "JsonWebTokenError"){
const message = "Json Web Token is Invalid , Try again !!" ,
err = new ErrorHandler(message , 400);
}
if(err.name == "TokenExpiredError"){
const message = "Json Web Token is Expired , Try again !!" ,
err = new ErrorHandler(message , 400);
}
if(err.cast == "CastError"){                                 // when u entred wrong inpput 
const message = `Invalid ${err.path}` ,
err = new ErrorHandler(message , 400);
}


const ErrorMessage = err.errors ? Object.values(err.errors).map((error)=> error.message).join(" ") : err.message





return resp.status(err.statusCode).json({
   success : false ,
   message : ErrorMessage , 

})






}

export default ErrorHandler  
