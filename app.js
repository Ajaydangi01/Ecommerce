require("./database/connect")
var express = require('express');
var path = require('path');
const postRouter = require("./routes/route");
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerJsDocs = YAML.load("./api.yaml")

require("dotenv").config();
const port = process.env.PORT
const host = process.env.HOST

var app = express();
app.use(express.json());
app.use("/createApi", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use(postRouter)
app.use(express.urlencoded({ extended: false }));

app.listen(port , host , () => {
  console.log(`Server is listening ${host} ${port}`)
})

module.exports = app;
