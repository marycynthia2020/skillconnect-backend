const express = require("express");
const db = require("./models");
const authRoute = require("./routes/auth.routes");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! Welcome to SkillConnect");
});

// use all routes
app.use('/auth', authRoute)

//app error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Internal server errror'
  });
});

async function startServer() { //starting the server, connecting to the ddatabase and initializing sequelize
  try {
    await db.sequelize.authenticate()
    console.log('Database connection succesfull')
    app.listen(PORT, ()=>{
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()