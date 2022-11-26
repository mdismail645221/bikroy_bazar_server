const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');

// const stripe = require('stripe')(process.env.PK_KEY);
// console.log(stripe)


// pass ==> zVNc0wb50ZWu38Za
//  user= bikroyBazar645221



// middleware
app.use(cors());
// app.use(express.static("public"));
app.use(express.json());




// start ====>
app.get('/', (req, res) => {
    res.send('assignment 12 is running.')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://bikroyBazar645221:zVNc0wb50ZWu38Za@cluster0.cn0mdvb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db("bikroyBazar645221").collection("allCategories")
        const usersCollection = client.db("bikroyBazar645221").collection("users")
        const productsCollection = client.db("bikroyBazar645221").collection("products");
        const bookingCollection = client.db("bikroyBazar645221").collection("bookings");

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/products', async(req, res)=>{
           const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })


        app.get('/products/:id', async(req, res)=>{
            const id = parseInt(req.params.id);
            const query = {category_id: id};
            const cursor = await productsCollection.find(query).toArray();
             res.send(cursor)
        })

        // ===============> buyers products booking info data seve in database  <=================//
        app.post('/bookings', async(req, res)=> {
            const bookingInfo = req.body;
            const result = await bookingCollection.insertOne(bookingInfo);
            res.send(result)
        })

       
        // ==============> POST METHOD API SAVE INTO THE MONGODB DATABASE USER INFO <==============//
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            console.log(userInfo);
            const result = await usersCollection.insertOne(userInfo);
            res.send(result)
          })

        //   admin & buyer & serler api 
        app.get('/users/admin/:email', async(req, res)=> {
            const email = req.params.email;
            const query = {email: email};
            const result = await usersCollection.findOne(query);
            res.send(result)
        })



    }
    catch {
        (error) => {
            console.log(error)
        }
    }

}
run().catch((error) => console.log(error));





app.listen(port, () => {
    console.log('assignment 12', port)
})



