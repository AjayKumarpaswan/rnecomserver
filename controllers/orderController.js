import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";

export const createOrderController = async (req, res) => {
    try {
      const {
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemPrice,
        tax,
        shippingCharges,
        totalAmount,
      } = req.body;
      //valdiation
      // create order
      await orderModel.create({
        user: req.user._id,
        shippingInfo,
        orderItems,
        paymentMethod,
        paymentInfo,
        itemPrice,
        tax,
        shippingCharges,
        totalAmount,
      });
  
      // stock update
      for (let i = 0; i < orderItems.length; i++) {
        // find product
        const product = await productModel.findById(orderItems[i].product);
        product.stock -= orderItems[i].quantity;
        await product.save();
      }
      res.status(201).send({
        success: true,
        message: "Order Placed Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Create Order API",
        error,
      });
    }
  };

  //get all orders
  export const getMyOrdersController=async(req,res)=>{
  try {
    //find orders
    const orders=await orderModel.find({user:req.user._id})
    //validation
    if(!orders){
    return res.status(404).send({
    success:false,
    message:"no orders found"
    })
    }
    res.status(200).send({
    success:true,
    message:"yours orders data",
    totalOrders:orders.length,
    orders
    })
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Create Order API",
        error,
      });
  }
  }
  //find a single orders
  export const singleOrderDetailsController=async(req,res)=>{
  try {
    //find order
    const order=await orderModel.findById(req.params.id)
    //validation
    if(!order){
    return res.status(404).send({
    success:false,
    message:"no order found"
    })
    }
res.status(200).send({
success:true,
message:"your order fetched",
order
})
  } catch (error) {
    console.log(error);
    //cast error
    if (error.name == "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in Getting single order api",
      error,
    });
  }
  }
  //payment accepts
  export const paymentController=async(req,res)=>{
  try {
    //get amount
    const {totalAmount}=req.body
    //validation
    if(!totalAmount){
    return res.status(404).send({
    success:false,
    message:"Total Amount is require"
    })
    }
 const{client_secret}= await stripe.paymentIntents.create({
    amount:Number(totalAmount*100),
    currency:"inr"
    })
    res.status(200).send({
    success:true,
    client_secret
    })
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Payment Accept API",
        error,
      });
  }
  }
  //===========Admin Section========
  export const getAllOrdersController=async(req,res)=>{
  try {
    const orders=await orderModel.find({})
    res.status(200).send({
  success:true,
  message:"All orders Data",
  totalOrders:orders.length,
  orders,
    })
  } catch (error) {
    console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In Admin  API",
        error,
      });
  }
  }
  //change order status
  export const changeOrderStatusController=async(req,res)=>{
  try {
     //find order
     const order=await orderModel.findById(req.params.id)
     //validation
     if(!order){
       return res.status(404).send({
      success:false,
      message:"Order not found"
      })
    }
    //working on orderstatus
    if(order.orderStatus==='processing') order.orderStatus='shipped'
    else if(order.orderStatus=='shipped'){
    order.orderStatus='delivered'
    order.deliverdAt=Date.now()

    }
    else{
    return res.status(500).send({
    success:false,
    message:"order already delivered"
    })
    }
    await order.save()
    res.status(200).send({
    success:true,
    message:"Order status updated"
    })
  } catch (error) {
    console.log(error);
    //cast error
    if (error.name == "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in Getting single order api",
      error,
    });
  }
  }