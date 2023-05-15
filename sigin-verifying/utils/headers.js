const getCredentials = (req) => {
    console.log("entro a credencials");
    
    const { authorization } = req.headers;
  
    if (!authorization) {
      throw new Error("No authorization header provided");
    }
  
    // Basic Z2xyb2Rhc3o6cGxhdHpp
    const [type, credentials] = authorization.split(" ");
    console.log("estas son las credenciales : ",credentials);
    if (type !== "Basic") {
      throw new Error("Authorization type must be Basic");
    }
  
    // username:password in base 64
    const [username, password] = Buffer.from(credentials, "base64")
      .toString()
      .split(":");
  
    return { username, password };
  };
  
   const getToken = (req) => {
    console.log("entro a get token");
    const { authorization } = req.headers;
  
    if (!authorization) {
      throw new Error("No authorization header provided");
    }
  
    // Bearer eyJhbGciOiJIUzI1(...)
    const [type, token] = authorization.split(" ");
  
    if (type !== "Bearer") {
      throw new Error("Authorization type must be Bearer");
    }
  
    return token;
  };
  module.exports={
    getCredentials,
    getToken
  }