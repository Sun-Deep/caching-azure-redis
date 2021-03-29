const express = require("express");
const client = require("./redis-conntect");

const app = express();

/**
 * @desc to get cached string
 * @api /name
 */

app.get("/name", (req, res) => {
  client.get("name", (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong...");
    }
    return res.send(reply);
  });
});

/**
 * @desc to store string
 * @api /name/:name
 */
app.get("/name/:name", (req, res) => {
  client.set("name", req.params.name, (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong...");
    } else {
      return res.send("Name cached successfully...");
    }
  });
});

/**
 * @desc to store lists
 * @api /lists
 */

app.post("/lists", (req, res) => {
  const fruits = ["apple", "banana", "grapes"];
  const multi = client.multi();
  for (let i = 0; i < fruits.length; i++) {
    multi.rpush("fruits", fruits[i]);
  }
  multi.exec((err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong..");
    } else {
      console.log(reply);
      return res.send("Lists cached successfully");
    }
  });
});

/**
 * @desc to get lists from cache
 * @api /lists
 */

app.get("/lists", (req, res) => {
  const fruit = [];
  client.lrange("fruits", 0, -1, (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong..");
    } else {
      reply.forEach((f) => {
        console.log(f);
        fruit.push(f);
      });
      return res.send(fruit);
    }
  });
});

/**
 * @desc to store hashset
 * @api /hashset
 */

app.post("/hashset", (req, res) => {
  const phones = {
    samsung: "Galaxy Note 10",
    apple: "Iphone 12",
    Xoami: "MI Note 9",
  };

  client.hmset("phones", phones, (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong..");
    } else {
      return res.send("Object cached successfully as hashset..");
    }
  });
});

/**
 * @desc to get cached hashset
 * @api /hashset
 */

app.get("/hashset", (req, res) => {
  client.hgetall("phones", (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong..");
    } else {
      return res.send(reply);
    }
  });
});

/**
 * @desc to store set
 * @api /set
 */

app.post("/set", (req, res) => {
  client.sadd("username", "nepali", (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong..");
    } else {
      return res.send("Set cached successfully");
    }
  });
});

/**
 * @desc to get set values
 * @api /set
 * @method GET
 */

app.get("/set", (req, res) => {
  client.smembers("username", (err, reply) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong..");
    } else {
      return res.send(reply);
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log("Server running..");
  }
});
