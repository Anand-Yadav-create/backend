import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
// import cloudinary from "./utils/cloudinary.js";

// import path from "path";
dotenv.config({});


const app=express();

// const _dirname=path.resolve();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const corsoptions={
    origin:'https://frontendpro-e3ja.onrender.com.onrender.com',
    credentials:true,
    
   
}
app.use(cors(corsoptions));



const port=process.env.PORT||3000;

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);

// app.use(express.static(path.join(_dirname,"/frontend/build")));
// app.get('*',(_,res)=>{
//     res.sendFile(path.resolve(_dirname,"frontend","build","index.html"));
// })

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(port,()=>{
    connectDb();
    
});

