import mongoose, { mongo }  from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
   firstName : {
    type: String ,
    required : true ,
    minLength: [3 , "FIRST NAME MUST CONTAIN AT LEAST 3 CHARACTERS "]
   },

   lastName : {
    type: String ,
    required : true ,
    minLength: [3 , "LAST NAME MUST CONTAIN AT LEAST 3 CHARACTERS "]
   },

   email : {
    type: String ,
    required : true ,
    validator : [validator.isEmail , "please provide a valid email"]
   },

   phone : {
    type: String ,
    required : true ,
    minLength: [10 , "PHONE NUMBER  MUST CONTAIN MIN 10 NUMBER "] ,
    maxLength: [10 , "PHONE NUMBER  MUST CONTAIN  MAX 10 NUMBER "] ,
   },


   nic : {
    type: String ,
    required : true ,
    minLength: [5 , "NIC NUMBER  MUST CONTAIN MIN 5 UNIQUE NUMBER "] ,
    maxLength: [5 , "NIC NUMBER  MUST CONTAIN  MAX 5 UNIQUE NUMBER "] ,
   },

   dob : {
    type: Date ,
    required : [true , "DOB IS REQUIRED"] ,
   
   },

gender :  {
type : String ,
required : true , 
enum : ["Male" , "Female"] , 
},

password : {
type : String ,
minLength : [8, "PASSWORD MUST CONTAIN AT LEAST 8 CHARACTERS"],
required : true ,
select : false 
} , 

role : {
type : String ,
required : true , 
enum : ["Admin" , "Patient" , "Doctor"] , 
},

doctorDepartment: {
type : String , 
},

docAvatar: {
public_id : String ,
url : String  , 
}
});

userSchema.pre("save" , async function(next){
if(!this.isModified("password")){
    next();
}
this.password = await bcrypt.hash(this.password , 10 )
})

userSchema.methods.comparePassword = async function(enterPassword){
return  await bcrypt.compare(enterPassword , this.password);
};

userSchema.methods.generateJsonWebToken = function(){
return jwt.sign({id : this._id} , process.env.JWT_SECERT_KEY , {
    expiresIn : process.env.JWT_EXPIRES , 
})


}




export const User = mongoose.model("User" , userSchema);
