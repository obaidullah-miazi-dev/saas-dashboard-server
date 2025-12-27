const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONOGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWT_SECRET = process.env.JWT_SECRET;

async function run() {
  try {
    await client.connect();
    const db = client.db("Saas-DB");
    const usersCollection = db.collection("users");

    //    register api
    app.post("/register", async (req, res) => {
      const { email, password } = req.body;
      const existUser = await usersCollection.findOne({ email });
      if (existUser) {
        return res.send({ message: "This user already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = { email, password: hashedPassword, role: "user" };
      const result = await usersCollection.insertOne(newUser);
      res.send(result, { message: "Registration successful" });
    });

    // login api
    app.post("/loginUser", async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(401).send({ message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).send({ message: "Password incorrect" });
        }

        // jwt token generate
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        // console.log(token)

        res.send({ message: "Login successful", token });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
      }
    });

    const authenticate = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).send({ message: "No token provided" });

      const token = authHeader.split(" ")[1];
      // console.log(token)
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(403).send({ message: "Invalid or expired token" });
      }
    };

    app.get("/profile", authenticate, async (req, res) => {
      const user = await usersCollection.findOne({
        _id: new ObjectId(req.user.userId),
      });
      res.send({ email: user.email, role: user.role });
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
