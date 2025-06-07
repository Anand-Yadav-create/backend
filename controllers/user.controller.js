import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
// const admin = require("firebase-admin");
import admin from "../utils/firebase-admin.js";



export const register= async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,password,role}=req.body;

        if(!fullname || !email ||!phoneNumber ||!password ||!role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        const file=req.file;
        const fileUri=getDataUri(file);
        const cloudResponse= await cloudinary.uploader.upload(fileUri.content);

        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:'User alredy exist with this email',
                success:false,
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message:"Account created Successfully",
            success:true
        })
    }catch(error){
        console.log(error);

    }
}

export const login=async (req,res)=>{
    try{
        const {email,password,role}=req.body;
        if( !email ||!password ||!role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };

        let user =await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,

            })
        }
        const isPasswordMatch= await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect email or password.",
                success:false,
            })
        }
        if(role !== user.role){
            return res.status(400).json({
                message:"Account doesnot exist with current role",
                success:false,
            })
        };
        const tokenData={
            userId:user._id
        }
        const token= await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

export const logout=async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logout Successfully",
            success:true

        })
        
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {fullname,email,phoneNumber,bio,skills}=req.body;
        const file=req.file;
        // if(!fullname||!email||!phoneNumber||!bio||!skills){
        //     return res.status(400).json({
        //         message:"Something is missing",
        //         success:false
        //     });
        // };
        let fileUri=null;
        let cloudResponse=null;
        if(file){
         fileUri=getDataUri(file);
          cloudResponse=await cloudinary.uploader.upload(fileUri.content);
        
        }
         

        


        
        let skillArray;
        if(skills){
         skillArray=skills.split(",");
        }
        const userId=req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            })
        }
        if(fullname) user.fullname=fullname
        
        if(email) user.email=email

        if(phoneNumber) user.phoneNumber=phoneNumber

        if(bio) user.profile.bio=bio
        if(skills) user.profile.skills=skillArray

        if(cloudResponse){
            user.profile.resume =cloudResponse.secure_url
            user.profile.resumeOriginalName=file.originalname
        }

        await user.save();

        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return  res.status(200).json({
            message:"profile updated successfully",
            user,
            success:true,
        })
        
    } catch (error) {
       
        console.log(error);
        
    }
}

export const googleLogin=async(req,res)=>{
    const { token: firebaseToken } = req.body;
    try {


        const decoded = await admin.auth().verifyIdToken(firebaseToken);

    const { email, name, picture} = decoded;




    //  let user =await User.findOne({email});
    //     if(!user){
    //         return res.status(400).json({
    //             message:"Incorrect email or password",
    //             success:false,

    //         })
    //     }
    //     const isPasswordMatch= await bcrypt.compare(password,user.password);
    //     if(!isPasswordMatch){
    //         return res.status(400).json({
    //             message:"Incorrect email or password.",
    //             success:false,
    //         })
    //     }
    //     if(role !== user.role){
    //         return res.status(400).json({
    //             message:"Account doesnot exist with current role",
    //             success:false,
    //         })
    //     };
    //     const tokenData={
    //         userId:user._id
    //     }
    //     const token= await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

    //     user={
    //         _id:user._id,
    //         fullname:user.fullname,
    //         email:user.email,
    //         phoneNumber:user.phoneNumber,
    //         role:user.role,
    //         profile:user.profile
    //     }
    //     return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
    //         message:`Welcome back ${user.fullname}`,
    //         user,
    //         success:true
    //     })


    // Find or create user in your DB
    let user = await User.findOne({ email });
    if (!user) {
        const file=picture;
        const fileUri=getDataUri(file);
        const cloudResponse= await cloudinary.uploader.upload(fileUri.content);

        user=await User.create({
            fullname:name,
            email,
            phoneNumber:9999999999,
           
            role:student,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });
    //   user = await User.create({ email, name, avatar: picture, provider: "google" });
    }



     // Create your own JWT
    const jwtToken = jwt.sign(
      { id: user._id},
      process.env.SECRET_KEY,{expiresIn:'1d'}
      
    );



     // Send cookie
    // return res
    //   .status(200)
    //   .cookie("token", jwtToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "None", // important for cross-origin
    //     maxAge: 1 * 24 * 60 * 60 * 1000,
    //   })
    //   .json({ success: true, user });

          return res.status(200).cookie("token",jwtToken,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true
        })

        
    } catch (error) {

        console.error("Google login error:", err.message);
    res.status(401).json({ success: false, message: "Invalid Google token" });
        
    }
}