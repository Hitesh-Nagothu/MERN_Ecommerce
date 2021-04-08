const { request, response } = require("express")
const {errorHandler} = require('../helpers/dbErrorHandler')

const User = require('../models/user')
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); //authorization check

exports.signUp=(request, response)=>{
    console.log("Request body",request.body);
    const user = new User(request.body);
    
    user.save((err, user)=>{
        if(err){
            return response.status(400).json({
                err:errorHandler(err)
            });
        }
        user.salt=undefined;
        user.hashed_password=undefined;
        response.json({
            user
        });
    })

};


exports.signIn=(request, response) => {

    //find the user based on email
    const {email, password}= request.body
    User.findOne({email}, (err, user)=>{
        if(err || !user){
            return response.status(400).json({
                error:"User with Email does not exist. Please signup!"
            })
        }
        //if user is found, check email and password
        //Create authenticate method in user model
        if (!user.authenticate(password)){
            return response.status(400).json({
                error:'Email and password not match'
            })
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET )

        //persist the token as 't' in cookie with expirey date
        response.cookie('t', token, {expire: new Date() + 9999})

        //return response with user and token to frontend client
        const {_id, name, email, role} = user
        return response.json({
            token, user:{ _id, email, name, role}
        });

    })

;}
