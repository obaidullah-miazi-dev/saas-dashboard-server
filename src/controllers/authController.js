const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const { findUserByEmail, createUser } = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;


exports.register = async(req,res)=>{
    const {email,password}= req.body

    const existUser = await findUserByEmail(email)
    if(existUser){
        return res.status(400).send({message:'User Already Exist'})
    }

    const hashedPassword = bcrypt.hash(password,10);

    const newUser = {
        email,
        password: hashedPassword,
        role: 'user',
    };

    const result = await createUser(newUser)
    res.send({message:'Registration successfully',result})
}
