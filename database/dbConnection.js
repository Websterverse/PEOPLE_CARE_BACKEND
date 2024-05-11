import mongoose from "mongoose";

export const dbConnection = ()=>{
mongoose.connect(process.env.MONGO_URI,{
dbName : "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM"
}).then(()=>{
console.log("CONNECTED TO DATABASE")
}).catch((err)=>{
    console.log(`SOME THING ERROR IN A DATABASE :  ${err}`)
})

}
 