const express = require("express");
const client = require("prom-client");
const app = express();

//collect default metrics
client.collectDefaultMetrics();

app.get("/", (req, res) => {
  res.send("Hello from DevOps Pipeline!!!!");
});

// metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});