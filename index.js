const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONOGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const db = client.db("Saas-DB");
    const usersCollection = db.collection("users");

    app.post("/user", async (req, res) => {
      const userInfo = req.body;
      const email = userInfo.email;
      const password = userInfo.password;
      const existUser = await usersCollection.findOne({ email });
      if (existUser) {
        return res.send({ message: "this user already exist" });
      }
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        email: email,
        password: hashedPassword,
      };
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    

    // app.get("/userGet", async (req, res) => {

    //   const result = await usersCollection.find().toArray();
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
