import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import  ErrorHandler from "../middlewares/errorMiddleware.js" 
import {User} from "../models/userSchema.js"
import {generate} from "../utils/jwtTokens.js"
import cloudinary from "cloudinary"


export const patientRegister =   catchAsyncErrors( async (req, res ,next)=>{
  
const {firstName , lastName , dob , email , role , nic , phone, password , gender} = req.body ;

if(!firstName || !lastName || !email || !phone || !password || !dob || !gender || !nic || !role )
{
return next ( new ErrorHandler("PLEASE FILL FULL FORM" , 400));
}

let user =  await User.findOne({email});
if(user){
    return  next(new ErrorHandler("USER ALREADY REGISTERD WITH THIS EMAIL" , 400));
}

user= await User.create({
firstName , 
lastName ,
email , 
phone , 
dob ,
password , 
role ,
nic , 
gender , 


}) ; 
generate(user , "USER REGISTERED !!" , 200 , res)
})



export const login = catchAsyncErrors( async (req , resp , next)=>{

const {email , password , confirmpassword , role} = req.body ; 
if(!email || !password || !confirmpassword || !role){
    return next( new ErrorHandler("PLEASE FILL FULL FORM" , 400));
}

if(password !== confirmpassword){
    return next( new ErrorHandler("PASSWORD DOES NOT MATCHED !!" , 400));
}

const user = await User.findOne({email}).select("+password");
if(!user){
    return next( new ErrorHandler("INVALID PASSWORD OR EMAIL!!" , 400));
}
const isPasswordMatched = await user.comparePassword(password) 
if(!isPasswordMatched){
    return next( new ErrorHandler("INVALID PASSWORD OR EMAIL" , 400));
}


if(role !== user.role){
    return next( new ErrorHandler("USER WITH THIS ROLE IS NOT FOUND" , 400));
};
generate(user , "USER LOGGED IN SUCCESSFULLY !!" , 200 , resp);
})

// adding new admin // 
export const addNewAdmin = catchAsyncErrors(async(req , resp ,next )=>{
    const {firstName , lastName , dob , email ,  nic , phone, password , gender} = req.body ;
    if(!firstName || !lastName || !email || !phone || !password || !dob || !gender || !nic )
    {
    return next ( new ErrorHandler("PLEASE FILL FULL FORM" , 400));
    }
    
const isRegistered =  await User.findOne({email});
if(isRegistered){
    return next ( new ErrorHandler(` ADMIN ALREADY REGISTERED WITH THIS EMAIL` , 400));
}
const admin = await User.create({
    firstName , lastName , dob , email ,  nic , phone, password , gender , role : "Admin"
})
resp.status(200).json({
success  : true,
message : "NEW ADMIN REGISTERED"
})
}) 

// getting all doctors // 


export const getAllDoctors =  catchAsyncErrors(async(req , resp , next)=>{
const Doctor = await User.find({role : "Doctor"});
resp.status(200).json({
success : true,
Doctor,
})
})

// getall user details ///
export const getUserDetails = catchAsyncErrors(async(req , resp , next)=>{
const user = req.user ;
resp.status(200).json({
    success : true , 
    user ,
})
})



export const logOutAdmin = catchAsyncErrors( async(req , resp , next)=>{
resp.status(200)
.cookie("adminToken" , "" , {
    httpOnly : true , 
    expires : new Date(Date.now())

})

.json({
success : true , 
message : "USER LOGOUT SUCCESSFULLY" , 
})
})


export const logOutPatient = catchAsyncErrors( async(req , resp , next)=>{
    resp.status(200)
    .cookie("patientToken" , "" , {
        httpOnly : true , 
        expires : new Date(Date.now())
    
    })
    
    .json({
    success : true , 
    message : "USER LOGOUT SUCCESSFULLY" , 
    })
    })
    

// add new doctor //

// export const addNewDoctor = catchAsyncErrors(async (req , resp , next)=>{
// if(!req.files || Object.keys(req.files).length === 0 ){
//     return next(new ErrorHandler("Doctor Avatar Required !!" , 400))
// }

// const {docAvatar} = req.files ; 
// const allowedFormats = ["image/png" , "image/jpeg" , "image/webp"];
// if(!allowedFormats.includes(docAvatar.mimetype)){
// return next(new ErrorHandler("FILE FORMATE WAS NOT SUPPORTED" , 400))
// }

// const {firstName , 
//     lastName ,
//     email , 
//     phone , 
//     dob ,
//     password , 
//     nic , 
//     gender , 
//     doctorDepartment, 
//     } = req.body ; 

// if(!firstName || !lastName || !email || !phone || !dob || !nic || !password || !gender || !doctorDepartment ){
// return next(new ErrorHandler("PLEASE PROVIDE FULL DETAILS" , 400))
// }

// const isRegistered = await User.findOne({email});
// if(isRegistered){
//     return next(new ErrorHandler(`${isRegistered.role} is already registered with this role` , 400))
// }

// const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath)
// if(!cloudinaryResponse || cloudinaryResponse.error){
//     console.error("Cloudinary Error:" , cloudinaryResponse.error || "UNKNOWN CLOUDINARY ERROR")
// }

// const doctor = await User.create({
//     firstName , 
//     lastName ,
//     email , 
//     phone , 
//     dob ,
//     password , 
//     nic , 
//     gender , 
//     doctorDepartment, 
//       role : "Doctor",
//       docAvatar :  {
// public_id : cloudinaryResponse.public_id ,
// url : cloudinaryResponse.secure_url ,
 
//       }, 
// })
// resp.status(200)
// .json({
// success : true  ,
// message : "NEW DOCTOR REGISTERED !",
// doctor
// })

 
// })


export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      doctorDepartment,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password ||
      !doctorDepartment ||
      !docAvatar
    ) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(
        new ErrorHandler("Doctor With This Email Already Exists!", 400)
      );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
      );
    }
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Doctor",
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "New Doctor Registered",
      doctor,
    });
  });
  
























