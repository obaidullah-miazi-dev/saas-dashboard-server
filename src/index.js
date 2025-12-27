require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { initUsersCollection } = require("./models/userModel");

// middleware
app.use(cors());
app.use(express.json());


async function startsServer() {
  const db = await connectDB();
  initUsersCollection(db)

  app.use('/',authRoutes)

  app.get('/',(req,res)=>{
    res.send('Welcome to Server')
  })

  app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
  })
}

startsServer();
