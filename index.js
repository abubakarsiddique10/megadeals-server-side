const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://megadealsUsers:SmP6ADnP1LqfJWil@cluster0.4txni.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('megadeals').collection('products');

        const addToCartCollection = client.db('megadeals').collection('carts');

        // get products
        app.get('/products', async (req, res) => {
            const products = await productsCollection.find().toArray();
            res.send(products)
        })

        // get one product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product)
        })

        // post data
        app.post("/cart", async (req, res) => {
            const product = req.body.product;
            const result = await addToCartCollection.insertOne(product);
            res.send(result)
        });
		
        // get cart products
        app.get("/carts", async (req, res) => {
            const carts = await addToCartCollection.find().toArray();
            res.send(carts)
        })
    }
    finally {

    }
}
run().catch(console.dir);







app.get("/", (req, res) => {
    res.send("server running");
});

app.listen(port, () => {
    console.log('listen', port)
});
