import { token } from "morgan";
import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary  from 'cloudinary';
//for register
export const registerController = async (req, res) => {
  try {
    //destructuring all properties from model
    const { name, email, password, address, city, country, phone,answer } = req.body;

    //validation
    if (
      !name ||
      !email ||
      !password ||
      !city ||
      !address ||
      !country ||
      !phone||!answer
    ) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    //existing user
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "email already taken",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer
    });
    res.status(201).send({
      success: true,
      message: "Registration successfull,please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register Api",
      error,
    });
  }
};

//for login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "please Add Email Or Passord",
      });
    }

    //user
    const user = await userModel.findOne({ email });
    //user validation

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not found",
      });
    }
    //check password
    const isMatch = await user.comparePassword(password);
    //validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    //token
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token,{
      expires:new Date(Date.now() + 15*24*60*60*1000),  
     secure:process.env.NODE_ENV==="development"?true:false,
     httpOnly:process.env.NODE_ENV==="development"?true:false,
     sameSite:process.env.NODE_ENV==="development"?true:false,
    })
      .send({
        success: true,
        message: "login Successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login api",
      error,
    });
  }
};

//for profile controller
export const getUserProfileController=async(req,res)=>{
    const user=await userModel.findById(req.user._id);
    user.password=undefined;
try {
    res.status(200).send({
    success:true,
    message:"profile is fetched successfully",
    user
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
    success:false,
    message:"Error while fetching profile",
    error
    })
}
}

//for logout controller
export const logoutController=async(req,res)=>{
try {
  res.status(200).cookie("token","",{
    expires:new Date(Date.now()),  
    secure:process.env.NODE_ENV==="development"?true:false,
    httpOnly:process.env.NODE_ENV==="development"?true:false,
    sameSite:process.env.NODE_ENV==="development"?true:false,
  }).send({
  success:true,
  message:"Logout successfully"
  })
} catch (error) {
  res.status(500).send({
  success:false,
  message:"Error in logout API"
  })
}
}
//update profile
export const updateProfileController=async(req,res)=>{
try {
  const user=await userModel.findById(req.user._id)

  const{name,email,address,city,country,phone}=req.body
  
  //validation + update
if(name) user.name=name
if(email) user.email=email
if(address) user.address=address
if(city) user.city=city
if(country) user.country=country
if(phone) user.phone=phone

//save user
  await user.save()
  res.status(200).send({
  success:true,
  message:"user Profile updated"
  })
} catch (error) {
  console.log(error)
  res.status(500).send({
  success:false,
  message:"Error in Updating Profile",
   error  
})
}
}

//update user password
export const updatePasswordController=async(req,res)=>{
try {
   const user=await userModel.findById(req.user._id)
 
   const{oldPassword,newPassword}=req.body

   //validation
   if(!oldPassword || !newPassword){
  return res.status(500).send({
   success:false,
   message:"Please provide old or new password"
  })
  }

  //old password check
   const isMatch=await user.comparePassword(oldPassword)
    //validation
    if(!isMatch){
    return res.status(500).send({
     success:false,
     message:"Invalid Old password"
    })
    }

    //set new password
     user.password=newPassword
     await user.save()
     res.status(200).send({
    success:true,
    message:"password updated successfully"
    })
} catch (error) {
  console.log(error)
 res.status(500).send({
 success:false,
 message:"Error in update password Api",
 error,
})
}
}

//update user profile pics

export const updateProfilePicController=async(req,res)=>{
try {
 const user= await userModel.findById(req.user._id)
 //get file from client photo
 const file=getDataUri(req.file)
 //delete previous image
 await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
 //update
 const cdb=await cloudinary.v2.uploader.upload(file.content)
    user.profilePic={
    public_id:cdb.public_id,
    url:cdb.secure_url
    }
 //save functions
 await user.save()
 res.status(200).send({
  success:true,
  message:"profile pics updated"
})
} catch (error) {
  console.log(error)
  res.status(500).send({
  success:false,
  message:"Error in update profile pic Api",
  error,
  })
}
}
//forgot password
export const passwordResetController=async(req,res)=>{
try {
  //user get email || newpassword || answer
  const {email,newPassword,answer}=req.body
//validation
if(!email ||!newPassword ||!answer)
{
return res.status(500).send({
success:false,
message:"Please Provide All Fields"
})
}
//find user
const user=await userModel.findOne({email,answer})
//validation
if(!user){
return res.status(404).send({
success:false,
message:"Invalid email or answer"
})
}
//save user password
user.password=newPassword;
await user.save();
res.status(200).send({
success:true,
message:"Your password has been reset please login"

})
} catch (error) {
  console.log(error)
  res.status(500).send({
  success:false,
  message:"Error in password reset Api",
  error,
  })
}
}