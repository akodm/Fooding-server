const redis = require("redis");
const { REDIS_PORT, REDIS_HOST, REDIS_AUTH } = process.env;
const client = redis.createClient({
  port: REDIS_PORT,
  host: REDIS_HOST,
  db : 0,
});

client.on("connect", function() {
  console.log("redis connecting..");
  client.auth(REDIS_AUTH);
});

client.on("ready", function() {
  console.log("redis connect success !");
});

client.on("error", function(error) {
  console.error("redis error log:", error.message);
  console.log("redis connect failed..");
  client.quit();
});

client.on("end", function() {
  console.log("redis connect end..");
});

const { promisify } = require("util");

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  client,
  getAsync,
  setAsync,
};

/**
 * redis-server --service-stop
 * redis-server --service-start
 * redis-server --service-restart
 * redis-cli -> CONFIG SET requirepass "..."
 */