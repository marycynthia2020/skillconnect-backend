const express = require("express");
const db = require("./models");
require("dotenv").config();
const app = express();
const cookieParser = require('cookie-parser')
const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes")
const artisanRoute = require("./routes/artisan.routes")
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello! Welcome to SkillConnect");
});

// use all routes
app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/artisans',  artisanRoute)

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