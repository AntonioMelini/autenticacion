require('dotenv').config();

const users = [
   { id:1,
    username:"antonio",
    password:"Casaanto1",
    fullname:"antonio melini"
    }
]

const getUser = (username, password)=>{
    console.log("entro a get user ",username,password);
    const user = users.filter((user)=> user.username === username)
    console.log("este es el user ",user);
    if( !user || user[0].password != password) {
        throw new Error ('invalid credentials')
    }

    return user
}
module.exports = {
    getUser
}