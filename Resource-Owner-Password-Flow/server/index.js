const axios=require('axios');
const express=require('express')
const querystring=require('node:querystring');
const path=require('path');
require('dotenv').config();

const CLIENT_ID=process.env.CLIENT_ID;
const CLIENT_SECRET=process.env.CLIENT_SECRET;
const API_AUDIENCE=process.env.API_AUDIENCE;
const USERNAME=process.env.USERNAME_;
const PASSWORD=process.env.PASSWORD;
const DOMAIN=process.env.DOMAIN;

const AUTHO_TOKEN_URL=`https://${DOMAIN}/oauth/token`

const app=express();



app.get('/api/autho',async(req,res)=>{
    try {
        //console.log(CLIENT_ID,CLIENT_SECRET,API_AUDIENCE,USERNAME,PASSWORD,DOMAIN);
        const scopes = ["read:sample"];

  const response= await axios({
    method: "POST",
    url:AUTHO_TOKEN_URL,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: querystring.stringify({
      grant_type: "password",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: scopes.join(" "),
      audience: API_AUDIENCE,
      username: USERNAME,
      password: PASSWORD,
    }),
  });


    
  const {access_token}=response.data;

  res.setHeader(
    "Set-Cookie",`acces_token_ROP=${access_token}; Path=/; HttpOnly`
  );
  res.send({"acces Token":access_token});
  





    } catch (error) {
        res.send(error)
    }
})
app.get('/*',(req,res)=>{
    res.sendFile(path.resolve("client","index.html"))
})

app.listen(3001,()=>{
    console.log("Server running ...");
})