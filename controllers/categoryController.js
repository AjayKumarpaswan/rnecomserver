import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

//Create  categories
export const createCategory=async(req,res)=>{
try {
    const {category}=req.body;
    //validation
    if(!category){
    return res.status(404).send({
      success:false,
      message:"Please Provide category name"
    })
    }
//create category
await categoryModel.create({category})
res.status(201).send({
success:true,
message:`${category} category created successfully`
})

} catch (error) {
    console.log(error)
    res.status(500).send({
    success:false,
    message:"Error in Create CAt api"
    })
}
}

//get all category
export const getAllCategoriesController=async(req,res)=>{
try {
    //find category
    const categories=await categoryModel.find({});
    res.status(200).send({
    success:true,
    message:"Categories fetch successfully",
    totalCategories:categories.length,
    categories
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
    success:false,
    message:"Error in Get All CAt api"
    })
}
}

//delete categories
export const deleteCategoryController=async(req,res)=>{
try {
    //find category
    const category=await categoryModel.findById(req.params.id)
    //validation
    if(!category){
    return res.status(500).send({
    success:false,
    message:"Category not found"
    })
    }

    //find product with this category id
    const products=await productModel.find({category:category._id})
    //update product category
    for(let i=0;i<products.length;i++){
    const product=products[i]
    product.category=undefined
    await product.save()
    }
    //delete category
    await category.deleteOne()
    res.status(200).send({
    success:true,
    message:"category Deleted successfully"
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
      message: "Error in  Delete category api",
      error,
    });
}
}

//update categories
export const updateCategoryController=async(req,res)=>{
    try {
        //find category
        const category=await categoryModel.findById(req.params.id)
        //validation
        if(!category){
        return res.status(500).send({
        success:false,
        message:"Category not found"
        })
        }
            //get new categories
     const{updatedCategory}=req.body

        //find product with this category id
        const products=await productModel.find({category:category._id})
        //update product category
        for(let i=0;i<products.length;i++){
        const product=products[i]
        product.category=updatedCategory
        await product.save()
        }
        if(updatedCategory) category.category=updatedCategory
        await category.save()
        res.status(200).send({
        success:true,
        message:"category Updated successfully"
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
          message: "Error in  Update category api",
          error,
        });
    }
}