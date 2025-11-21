const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = 
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`   <p>helo</p>`);
});

app.use((req, res, err, next) => {
  res.status(500).send("Error connecting to the server");
});


async function startServer() {
    
  app.listen(PORT, err => {
    if (err) {
      console.log("Error connecting to the server");
      return;
    }
    console.log(`server is running on PORT ${PORT}`);
  });
}

startServer()