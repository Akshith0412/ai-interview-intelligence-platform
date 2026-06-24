const express=require('express')
const app=express()
const cors=require('cors')
const authRoutes = require("./modules/auth/auth_routes");
const resumeRoutes = require(
  "./modules/resume/resume.routes"
);
const analysisRoutes = require(
  "./modules/analysis/analysis.routes"
);
const interviewRoutes = require(
  "./modules/interview/interview.routes"
);
const dashboardRoutes = require(
  "./modules/dashboard/dashboard.routes"
);


app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use(
  "/api/analysis",
  analysisRoutes
);
app.use(
  "/api/interview",
  interviewRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/job-description",
  require(
    "./modules/jobDescription/jobDescription.routes"
  )
);

app.get("/",function(req,res){
    res.json({
        message:"AI Interview Intelligence Platform API",
    })
})

module.exports=app;