const express=require('express');
const  {getUser}  = require('./utils/users');
const  {signToken, verifyToken, validateExpiration}  = require('./utils/token');
const { getToken, getCredentials } = require('./utils/headers');
require('dotenv').config();

let app = express();

app.get('/public',(req,res)=>{
    res.send("todo bien es publica")
})
app.get('/private',(req,res)=>{
    try {
        console.log("entro a private");
        const token = getToken(req);
        const payload = verifyToken (token);

        validateExpiration (payload);
        res.send('i´m private');
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})
app.post('/token',async (req,res)=>{
    try {
        console.log("entro a token");
        const {username,password}=  getCredentials(req);
        const user = getUser(username, password);
        console.log("este es el user :",user);
        const token =await signToken(user[0]);
        console.log("este es el token :",token);
        res.send({ token })
    } catch (error) {
        res.status(400).send({ error: error.message});
    }
})

app.listen(process.env.PORT,()=>console.log(`escuchando en el puerto : ${process.env.PORT}`))