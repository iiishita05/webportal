const express=require('express');
const mongoose=require('mongoose');
const cors=require ('cors');
require ('dotenv').config();

const app=express();

const PORT = process.env.PORT || 5000;

app.use('/uploads',express.static('uploads'));


app.use(
  cors({
    origin: "*", // NOT RECOMMENDED for production
  })
);


app.use(express.json());
const authRoutes = require("./routes/web/authroutes");
app.use("/api/auth", authRoutes);



mongoose.connect(process.env.dbUrl).then(()=>console.log("mongodb connected")).catch(err=>console.error("mongodb connection error:",err));
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
console.log(
  "OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "Loaded" : "Missing"
);

const noticeRoutes=require('./routes/web/noticeRoutes');
app.use('/api/notices',noticeRoutes);

const libRoutes=require("./routes/web/libroutes");
app.use("/api/library", libRoutes);

const empRoutes=require('./routes/web/emproutes');
app.use("/api/employees",empRoutes);

const applicationRoutes = require("./routes/web/applicationroutes");
app.use("/api/applications", applicationRoutes);

const mlRoutes = require("./routes/web/mlroutes");
app.use("/api/mlroutes", mlRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const alertRoutes=require('./routes/web/alertrotes');
app.use("/api/alerts",alertRoutes);
app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
  })
);