import  express  from "express"
import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrdersController, paymentController, singleOrderDetailsController } from "../controllers/orderController.js";


import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";



const router=express.Router()

// order routes
//create order
router.post("/create", isAuth,createOrderController)

//get all orders
router.get("/my-orders",isAuth,getMyOrdersController)
//get single orders details
router.get("/my-orders/:id",isAuth,singleOrderDetailsController)

//accept  payments
router.post("/payments",isAuth,paymentController)

//===========Admin Pannel========
//get all orders
router.get("/admin/get-all-orders",isAuth,isAdmin,getAllOrdersController)

//change order staus
router.put("/admin/order/:id",isAuth,isAdmin,changeOrderStatusController)
export default router;