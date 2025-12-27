const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const {
  findUserByEmail,
  createUser,
  findUserById,
} = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const existUser = await findUserByEmail(email);
  if (existUser) {
    return res.status(400).send({ message: "User Already Exist" });
  }

  const hashedPassword = bcrypt.hash(password, 10);

  const newUser = {
    email,
    password: hashedPassword,
    role: "user",
  };

  const result = await createUser(newUser);
  res.send({ message: "Registration successfully", result });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).send({ message: "User not found" });
  }

  const isValidPassword = bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).send({ message: "Password Incorrect" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "5h" }
  );
  res.send({ message: "login successfully", token });
};

exports.profile = async (req, res) => {
  const user = await findUserById(new ObjectId(req.user.userId));
  res.send({ email: user.email, role: user.role });
};
