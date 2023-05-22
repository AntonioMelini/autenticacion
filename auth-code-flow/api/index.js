const express = require('express');
const querystring =require('querystring')
const app= express();
const axios = require('axios');
require('dotenv').config()



const client_id=process.env.CLIENT_ID        //"c09c370bb81641eb8c5e8b80e1fa27af";
const redirect_uri=process.env.REDIRECT_URI
const client_secret =process.env.CLIENT_SECRET



	
function genRandonString(length) {
   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
   let charLength = chars.length;
   let result = '';
   for ( var i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
   }
   return result;
}
const state = genRandonString(16)

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.header('Content-Security-Policy', "img-src 'self'");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
})
app.get('/api/autho',(req,res)=>{
    try {
      
        console.log("entro en el backend");
          const scopes=[
    "user-read-private",
    "user-read-email",
    "playlist-read-private"
]
   
            const queryParams = querystring.stringify({
              client_id,
              response_type: 'code',
              redirect_uri,
              state,
              scope:scopes
            });
          
            res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`); //esto te redirecciona a spotify haciendo al authorization request
          



            
        
    } catch (error) {
        res.send({error:error.message})
    }
})

app.get('/api/callback',async(req,res)=>{
  try {
    console.log("entro en callback :",req.query);   // entra aca porque cuando el usuario autoriza se encia el grant code a la URL de redireccion
    const code = req.query.code || null;

  let token= await axios({      // aca se envia el client auth + el codigo que devuelve el server
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
       headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,

      },
     
    })


    const { access_token, token_type }= token.data;
    console.log("este es el acces token", access_token);
    res.setHeader("Set-Cookie", [`_token_type=${token_type}; Path=/;`, `_access_token=${access_token}; Path=/;`]   )

    
    res.writeHead(302, { Location: 'http://localhost:3000/home' })
    res.end()











    // const { refresh_token } = token.data;

    //     axios.get(`http://localhost:3009/refresh_token?refresh_token=${refresh_token}`)
    //       .then(response => {                                                                           //esto seria el refresh token
    //         res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
    //       })
    //       .catch(error => {
    //         res.send(error);
    //       });
  }catch(error){
res.send({error:error.message})
  }
})

app.get('/api/miscosas/:access_token/:token_type',async (req,res)=>{
  try {
    const { access_token,token_type }= req.params
    console.log("entro a mis cosas");

     let spot = await axios.get('https://api.spotify.com/v1/me',{headers: {     //la peticion final con el token
       Authorization: `${token_type} ${access_token}`
     }})
     res.send(`<pre>${JSON.stringify(spot.data,null,2)}</pre>`)


  } catch (error) {
    res.send({error: error.message})
  }
})
app.get('/api/playlist',(req,res)=>{
  try {
    res.send("hola")
  } catch (error) {
    res.send({error: error.message})
  }
})


app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(3009,()=>console.log("Escuchando en el puerto 3009"))