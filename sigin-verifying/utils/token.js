require('dotenv').config();

const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET

const ONE_MINUTE_IN_MILISECONDS=60*1000;



const signToken = async(user) =>{
    console.log("entroa  singin token");
    const payload = {
        // el sub contiene el id del usuario
        sub: user.id,
        name: user.fullname,
        exp: Date.now() + ONE_MINUTE_IN_MILISECONDS

    }
    console.log("payload ; ", payload);
   
    return jwt.sign(payload,SECRET)
}



const verifyToken = (token)=>{
    
    return jwt.verify(token, SECRET);
}

const validateExpiration = (payload)=>{
    if(Date.now() > payload.exp ) {
        throw new Error('Token expired');
    }
}

module.exports={
    signToken,
    verifyToken,
    validateExpiration
}