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



dotenv.config({});


const app=express();



app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
   origin: 'https://frontendpro-e3ja.onrender.com',
  //  origin:"http://localhost:3000",
  // origin:"*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));



const port=process.env.PORT||3000;

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);




app.get('/', (req, res) => {
    res.send('Hello, World!');
  });


 
app.listen(port,()=>{
    connectDb();
    
});

