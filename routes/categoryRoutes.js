import  express  from "express"
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from "../controllers/categoryController.js";

import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";


const router=express.Router()

// categories routes
//create category
router.post("/create", isAuth,isAdmin,createCategory)
//get all categories
router.get("/get-all",getAllCategoriesController)
//delete categories
router.delete("/delete/:id",isAuth,isAdmin,deleteCategoryController)

//update category
router.put("/update/:id",isAuth,isAdmin,updateCategoryController)
export default router;