const { REDISCACHEHOSTNAME, REDISCACHEKEY } = require("./config");

const redis = require("redis");

module.exports = redis.createClient(6380, REDISCACHEHOSTNAME, {
  auth_pass: REDISCACHEKEY,
  tls: { servername: REDISCACHEHOSTNAME },
});
