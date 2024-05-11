import mongoose, { mongo }  from "mongoose";
import validator from "validator";


const messageSchema = new mongoose.Schema({
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


   message : {
    type: String ,
    required : true ,
    minLength: [10 , "MESSAGE  MUST CONTAIN AT LEAST 10 CHARACTERS "] ,
    
   },
})


export const Message = mongoose.model("Message" , messageSchema);
