const express = require('express');
require('dotenv').config();
const axios = require('axios')
const querystring= require('node:querystring')
const app = express();
const path = require('path');
const CLIENT_ID= process.env.CLIENT_ID;
const CLIENT_SECRET=process.env.CLIENT_SECRET;
 
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCOR_GUILDS_URL = "https://discord.com/api/users/@me/guilds";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";





app.get('/api/autho',async (req,res)=>{
    try {
        
        const scopes=["identify","guilds"];

      console.log(CLIENT_ID,CLIENT_SECRET);

        const response = await axios({
            method: "POST",
            url:DISCORD_TOKEN_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: querystring.stringify({
                grant_type: "client_credentials",
                client_id:CLIENT_ID,
                scope:scopes.join(" "),
                client_secret:CLIENT_SECRET
            })
        })


        const {access_token}= response.data;
        

        const userData = await axios({
            method:'GET',
            url:DISCORD_USER_URL,
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        })
        const guildData = await axios({
            method:'GET',
            url:DISCOR_GUILDS_URL,
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        })
       
        const {username,discriminator}= userData.data;
        res.status(200).json({
            user:{
                username: `${username}#${discriminator}`
            },
            guilds: guildData.data.map((guild)=>guild.name)

        })


    } catch (error) {
        res.send(error)
    }
})

app.get('/*',(req,res)=>{
    try {
        
        res.sendFile(path.resolve("client","index.html"))

    } catch (error) {
        res.send({error:error.message})
    }
})

app.listen(3001,()=>{
    console.log("Server running...");
})