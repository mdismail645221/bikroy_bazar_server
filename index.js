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
const uri = `${process.env.MONGODB_URL}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const categoriesCollection = client.db("bikroyBazar645221").collection("allCategories")
        const huaweiCollection = client.db("bikroyBazar645221").collection("huaweiPhones");

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: ObjectId(id) };
            const result = await categoriesCollection.findOne(filter);
            res.send(result)
        })

        // Modify the add Location
        // app.get('/addLocation', async(req, res)=> {
        //   const query = {
        //     location: "Dhaka"
        //   };
        //   const options = {upsert: true};
        //   const updateDoc = {
        //     $set: {
        //       Location: "Dhaka"
        //     }
        //   }
        //     const result = await categoriesCollection.updateMany(query, updateDoc, options);
        //   res.send(result)
        // })


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