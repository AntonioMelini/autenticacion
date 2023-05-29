const crypto =require( "node:crypto");

const generateCodeChallengeMethod = (codeChallenge) => {
  const base64CodeChallenge = crypto
    .createHash("sha256")
    .update(codeChallenge)
    .digest("base64");

  return Buffer.from(base64CodeChallenge, "base64").toString("base64url");
};
module.exports={generateCodeChallengeMethod}