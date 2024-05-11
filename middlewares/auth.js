import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"
import { User } from "../models/userSchema.js";


export const isAdminAuthenticated = catchAsyncErrors(async(req , resp , next)=>{

const token = req.cookies.adminToken ;     // create a cookies of name of adminToken 
if(!token){
return next(new ErrorHandler("ADMIN IS NOT AUTHENTICATED" , 400));
}

const decoded = jwt.verify(token , process.env.JWT_SECERT_KEY);
req.user = await User.findById(decoded.id);
if(req.user.role !== "Admin"){

 return next ( new ErrorHandler(`${req.user.role} not authorized for this resources !` , 403))

}
next(); 

})







export const isPatientAuthenticated = catchAsyncErrors(async(req , resp , next)=>{

    const token = req.cookies.patientToken ;
    if(!token){
    return next(new ErrorHandler("PATIENT IS NOT AUTHENTICATED" , 400));
    }
    
    const decoded = jwt.verify(token , process.env.JWT_SECERT_KEY);
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Patient"){
    
     return next ( new ErrorHandler(`${req.user.role} not authorized for this resources !` , 403))
    
    }
    next();
    
    }) 





