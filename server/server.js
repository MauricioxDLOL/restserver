
require("./config/config")

const express = require('express');
const mongoose = require("mongoose");
const path = require("path");

const app = express()

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta publica

app.use(express.static(path.resolve(__dirname,"../public")));

app.use(require("./routes/index"))

mongoose.connect(process.env.urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, () => {
    console.log("Base de datos ONLINE");
});
 
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto 3000`);
});

