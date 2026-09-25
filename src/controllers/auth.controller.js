const userModel = require('../models/user.model.js')
const jwt = require('jsonwebtoken')
const sendRegistrationEmail = require('../services/email.service.js');
/**
 * 
 * POST /api/auth/register
 */

async function registerUser(req,res){
    const{email,password,name} = req.body;

    const userExists = await userModel.findOne({
        email:email
    })
    if(userExists){
        return res.status(400).json({
            message:"User already exists with this email",
            status:"Failed"
        })
    }

    const user = await userModel.create({
        email,password,name
    })

    // Send welcome email before responding (fire-and-forget with logging)
    try {
        await sendRegistrationEmail(user.email, user.name);
    } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
    }

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.cookie("token",token);
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
        token
    });
}

/**
 * 
 * - POST /api/auth/login
 */
async function loginUser(req,res){
    const{email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"Email is invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
         return res.status(401).json({
            message:"Password is invalid"
        })
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.cookie("token",token);
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,

        },
        token
    });
} 

module.exports ={
    registerUser, loginUser
}