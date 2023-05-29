const express=require('express');
const path = require('path');
const { generateCodeChallengeMethod } = require('../utils/generateCodeChallenge');
const app= express();
const querystring= require('node:querystring');
const cookie = require('cookie')
const axios =require('axios');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const TWITTER_AUTH_URL= 'https://twitter.com/i/oauth2/authorize?'

function genRandonString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let charLength = chars.length;
    let result = '';
    for ( var i = 0; i < length; i++ ) {
       result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
 }




app.get('/api/autho', (req,res)=>{
    try {
        console.log("entro en api autho");
        const scope=['users.read','tweet.read','list.read'];
        
        
        const state = genRandonString(16);


        const codeVerifier = genRandonString(128); //codigo original
        const codeChallenge =  generateCodeChallengeMethod(codeVerifier);   //codigo encriptado

        const query = querystring.stringify({
            response_type:"code",
            client_id:CLIENT_ID,
            redirect_uri:REDIRECT_URI,
            scope:scope.join(" "),
            state,
            code_challenge:codeChallenge,
            code_challenge_method:'S256'  //metodo de encriptado del codigo
        })
        console.log(`${TWITTER_AUTH_URL}${query}`);
        res.setHeader("Set-Cookie",[
            `state=${state}; Path=/; HttpOnly`,
            `verifier=${codeVerifier}; Path=/; HttpOnly`
        ])

        res.writeHead(302, {Location: `${TWITTER_AUTH_URL}${query}`})
        res.end();
    } catch (error) {
        res.send({error: error.message})
    }
})

function stateOk(req){
    console.log("entro a stateOk :",req.query.state);
    let cookies= cookie.parse(req.headers.cookie)
    if(req.query.state!==cookies.state) throw new Error("Inavlid response")
    return cookies.verifier
}

app.get('/api/callback',async(req,res)=>{
    try {
        console.log("entroa  callback<:: ");
        let verifier=stateOk(req);
      
    
        
        const {code}=req.query
        //console.log(" ",code," ",CLIENT_ID," ",REDIRECT_URI," ",verifier);

        let response =await axios({
            method:'POST',
            url:'https://api.twitter.com/2/oauth2/token?',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data:querystring.stringify({
                code,
                grant_type:'authorization_code',
                client_id:CLIENT_ID,
                redirect_uri:REDIRECT_URI,
                code_verifier:verifier
            }),
            
        })
        console.log("a ver que hay aca <<<< >>>>> : ", response.data );
        let token= response.data.access_token;

        res.setHeader("Set-Cookie",
            `access_token=${token}; Path=/; HttpOnly`, 
        )

        res.writeHead(302, {Location: `/home`})
        res.end();

        
    } catch (error) {
        console.log(error);
        res.send({ error: error.message})
    }
})
app.get('/home',async(req,res)=>{
    try {
        let cookies= cookie.parse(req.headers.cookie)

        console.log(cookies);
        const TWITTER_ME_ENDPOINT= "https://api.twitter.com/2/me";
        
        

        let response = await axios({
           method:'GET',
           url:TWITTER_ME_ENDPOINT,
            headers:{
                Authorization: `Bearer ${cookies.access_token}`,
                'Content-Type':'application/json',
                
            }
        })

        console.log(response);
        res.send(response)
    } catch (error) {
        res.send({error: error})
    }
})
app.get('/',(req,res)=>{
    res.sendFile(path.resolve("singlePageUp","index.html"));
})

app.listen(3001,()=>{
    console.log("Server runnig....");
})