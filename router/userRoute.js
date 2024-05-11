import express from 'express'
import { login, patientRegister , addNewAdmin, getAllDoctors, getUserDetails, logOutAdmin, logOutPatient, addNewDoctor} from '../controller/userController.js';
import {isAdminAuthenticated , isPatientAuthenticated} from "../middlewares/auth.js"



const router = express.Router();

router.post("/patient/register" , patientRegister)
router.post("/login" , login)
router.post("/admin/addnew" , isAdminAuthenticated   , addNewAdmin)
router.get("/doctor" ,  getAllDoctors)
router.get("/admin/me" ,  isAdminAuthenticated , getUserDetails)
router.get("/patient/me" ,  isPatientAuthenticated , getUserDetails)
router.get("/admin/logout" ,  isAdminAuthenticated , logOutAdmin)
router.get("/patient/logout" ,  isPatientAuthenticated , logOutPatient)
router.post("/doctor/addnew" ,  isAdminAuthenticated ,  addNewDoctor)




export default router ;