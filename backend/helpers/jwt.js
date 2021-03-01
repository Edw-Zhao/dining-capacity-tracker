const expressJwt = require("express-jwt");

function authJwt() {
  let secret = "secretsqueech";
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: "/api/restaurants",
        methods: ["GET", "OPTIONS"],
      },
      {
        url: /\/api\/restaurants\/(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      "/api/users/login",
      "/api/users/signup",
    ],
  });
}

module.exports = authJwt;
