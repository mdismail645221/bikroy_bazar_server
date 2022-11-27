const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');


const stripe = require('stripe')(process.env.PK_KEY);
// console.log(stripe)


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



// JWT VERIFY 

async function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("unauthorized access")
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_TOKEN, function (err, decoded) {
        if (err) {
            res.status(403).send("forbidden access")
        }
        req.decoded = decoded;
        next()
    })
}




async function run() {
    try {
        const categoriesCollection = client.db("bikroyBazar645221").collection("allCategories")
        const usersCollection = client.db("bikroyBazar645221").collection("users")
        const productsCollection = client.db("bikroyBazar645221").collection("products");
        const bookingCollection = client.db("bikroyBazar645221").collection("bookings");
        const addProductCollection = client.db("bikroyBazar645221").collection("addProducts");


        // PAYMANT METHOD API
        app.post("/create-payment-intent", async (req, res) => {
            // return console.log(req.body)
            const booking = req.body;
            console.log(booking)
            const price = booking.resalePrice;
            const amount = price * 100;
      
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
              amount: amount,
              currency: "usd",
              "payment_method_types": ["card"],
            });
            res.send({
              clientSecret: paymentIntent.client_secret,
            });
          });


        // NOTE: MAKE SURE YOU USE VerifyAdmin after verifyJWT 
        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            // console.log(decodedEmail);
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);
            if (user?.role !== 'admin') {
                return res.status(403).send('forbidden access')
            }
            next()
        }


        // NOTE: MAKE SURE YOU USE VerifyAdmin after verifyJWT 
        const verifySellar = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            // console.log(decodedEmail);
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);
            if (user?.role !== 'Sellers') {
                return res.status(403).send('forbidden access')
            }
            next()
        }


        // SIGN IN  JWT TOKEN ACCESTOKEN IN USER 
        // ==========JWT TOKEN USERS =========//

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.JWT_TOKEN, { expiresIn: "10d" })
                return res.send({ sendToken: token })
            }
            return res.status(403).send({ sendToken: '' })
        })


        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })


        app.get('/products/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { category_id: id };
            const cursor = await productsCollection.find(query).toArray();
            res.send(cursor)
        })

        // ===============> buyers products booking info data seve in database  <=================//

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            //  console.log(email)
            const query = { email: email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result)

        })

        app.get('/bookings/payment/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result)
        })

        app.post('/bookings', async (req, res) => {
            const bookingInfo = req.body;
            const result = await bookingCollection.insertOne(bookingInfo);
            res.send(result)
        })


        // ==============> POST METHOD API SAVE INTO THE MONGODB DATABASE USER INFO <==============//

        app.get('/allusers', verifyJWT, verifyAdmin, async (req, res) => {
            console.log(req.decoded)
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })

        //   admin & buyer & serler api 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        // all sellars get api method
        app.get('/users/allsellars', async(req, res)=> {
            const sellarRole = req.query.role;
            // console.log(email)
            const query = { role: sellarRole }
            const result = await usersCollection.find(query).toArray();
            // console.log(result)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            // console.log(userInfo);
            const query = { email: userInfo.email };
            const sameUser = await usersCollection.findOne(query);
            console.log("sameUser", sameUser)
            // if(sameUser){
            //     res.send({message: "sorry tmi age ei email diya reg korecila"})
            // }
            const result = await usersCollection.insertOne(userInfo);
            res.send(result)
        })

        app.put('/users/admin/:id', async (req, res) => {
            // const decodedEmail = req.decoded.email;
            // const query = { email: decodedEmail };
            // const user = await usersCollection.findOne(query);
            // if (user?.role !== 'admin') {
            //   return res.status(403).send({ message: 'forbidden access' })
            // }

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            res.send(result)

        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result)
        })



        // ==================> sellar add a Products API method <=====================//

        app.get("/addProducts", verifyJWT, verifySellar, async (req, res) => {
            const query = {};
            const result = await addProductCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/addProducts', verifyJWT, verifySellar, async (req, res) => {
            const addProductsInfo = req.body;
            const result = await addProductCollection.insertOne(addProductsInfo);
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





