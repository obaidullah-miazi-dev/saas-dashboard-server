const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).send({message:'no token provided'})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        res.status(403).send({message:'Invalid or Expired Token'})
    }
}

module.exports = authenticate;