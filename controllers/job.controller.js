import { Job } from "../models/job.model.js";
import dotenv from "dotenv";
import axios from 'axios'; // ✅ ES Module


dotenv.config({});

//job create by admin
export const postJob = async(req,res)=>{
    try{
        const {title,description,requirements,salary,location,jobType,experience,position,companyId}=req.body;
        const userId=req.id;
        if(!title||!description||!requirements||!salary||!location||!jobType||!experience||!position||!companyId){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        };

        const job=await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId

        });
        return res.status(201).json({
            message:"New Job created successfully",
            job,
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

//job accessed by admin
export const getAlljobs = async(req,res)=>{
    try {
        const keyword=req.query.keyword||"";
        const query={
            $or:[
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
                {location:{$regex:keyword,$options:"i"}},

        ]
        };
        const jobs= await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json()({
                message:"jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
        
    } catch (error) {
        console.log(error);
        
    }
}


//Job accessed by student
export const getJobById = async(req,res)=>{
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(404).json({
                message:"Jobs not found",
                success:true
            })
        };
        return res.status(200).json({
            job,
            success:true
        })
        
    } catch (error) {
        console.log(error);
        
    }
}

//admin kitne job create kiya hai

export const getAdminJobs = async (req,res)=>{
    try {

        const adminId=req.id;
        const jobs=await Job.find({created_by:adminId}).populate({
            path:'company'
        });
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
        
    } catch (error) {
        console.log(error);
        
    }
}





export const browsejobs= async (req, res) => {
  const query = req.query.q || 'developer';
  const page = req.query.page || '1';
  

  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: query,
        page: page,
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    res.json(response.data.data); // send list of jobs
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch external jobs' });
  }
};
