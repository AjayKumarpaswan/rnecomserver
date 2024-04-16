import express from "express"
import { loginController, registerController,getUserProfileController, logoutController,updateProfileController, updatePasswordController, updateProfilePicController, passwordResetController } from "../controllers/userController.js";
import { isAuth } from './../middlewares/authMiddleware.js';
import { singleUpload } from './../middlewares/multer.js';
import { rateLimit } from 'express-rate-limit'
//Rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

//router Objects
const router=express.Router()

//routes for register
router.post("/register",limiter,registerController)
//routes for login
router.post("/login",limiter,loginController)

//for profile
router.get("/profile",isAuth,getUserProfileController)

//for logout
router.get("/logout",isAuth,logoutController)

//update profile
router.put("/profile-update",isAuth,updateProfileController)

//update-password
router.put("/update-password",isAuth,updatePasswordController)

//update profile pics
router.put("/update-picture",isAuth,singleUpload,updateProfilePicController)

//forgot Password
router.post("/reset-password",passwordResetController)
export default router;