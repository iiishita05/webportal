const express=require('express');
const mongoose=require('mongoose');
const cors=require ('cors');
require ('dotenv').config();

const app=express();

const PORT = process.env.PORT || 5000;







app.use(
  cors({
    origin: [
      
      "https://ab42-2405-201-6011-4a51-94d9-7590-e20d-5256.ngrok-free.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);



const { WebSocketServer } = require("ws");

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });


wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.send("Hello from WebSocket server!");

  ws.on("message", (message) => {
    console.log("Received message from client:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});



app.use('/uploads',express.static('uploads'));





app.use(express.json());
const authRoutes = require("./routes/web/authroutes");
app.use("/api/auth", authRoutes);



mongoose.connect(process.env.dbUrl).then(()=>console.log("mongodb connected")).catch(err=>console.error("mongodb connection error:",err));
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


const noticeRoutes=require('./routes/web/noticeRoutes');
app.use('/api/notices',noticeRoutes);

const libRoutes=require("./routes/web/libroutes");
app.use("/api/library", libRoutes);

const empRoutes=require('./routes/web/emproutes');
app.use("/api/employees",empRoutes);

const applicationRoutes = require("./routes/web/applicationroutes");
app.use("/api/applications", applicationRoutes);

const alertRoutes = require("./routes/web/alertrotes");
app.use("/api/alerts", alertRoutes);



