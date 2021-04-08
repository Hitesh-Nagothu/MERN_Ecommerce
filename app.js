const mongoose=require('mongoose');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require("dotenv").config();

//import routes
const userRoutes=require('./routes/user');

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(()=>console.log("DB connected")).catch(()=>console.log("Failed"))


//middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(expressValidator());

//routes middleware
app.use("/api",userRoutes)

//Useful when put to production
const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
} );



