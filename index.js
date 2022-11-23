const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');

// const stripe = require('stripe')(process.env.PK_KEY);
// console.log(stripe)


// middleware
app.use(cors());
// app.use(express.static("public"));
app.use(express.json());




// start ====>
app.get('/', (req, res)=> {
    res.send('assignment 12 is running.')
})



app.listen(port, () => {
    console.log('assignment 12', port)
  })