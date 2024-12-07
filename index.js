const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express()
const port  = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.trszs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDB').collection('product')
    const userCollection = client.db('productDB').collection('users')




    app.get('/product' , async(req , res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray()
        res.send(result);
    })

    // delet
    app.delete('/product/:id' , async (req ,res) => {
        const id =req.params.id;
        const query = {_id: new ObjectId(id)}
        const result =await productCollection.deleteOne(query)
        res.send(result)

    })
    //update
    app.put('/product/:id' , async(req , res) =>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedProduct = req.body
        const Product= {
            $set: {
                itemName:updatedProduct.itemName, 
      categoryName:updatedProduct. categoryName, 
      price:updatedProduct. price, 
      image:updatedProduct. image, 
      description:updatedProduct. description, 
      rating:updatedProduct. rating, 
      customization:updatedProduct. customization, 
      processingTime:updatedProduct. processingTime, 
      stockStatus:updatedProduct. stockStatus
            }
        }
        const result = await productCollection.updateOne(filter, Product,options)
        res.send(result)

    })


    //for details view
    app.get('/product/:id', async (req, res) => {
        const { id } = req.params;
        const product = await productCollection.findOne({ _id: new ObjectId(id) });
        
        res.send(product);
      });
      
    
    
      

    app.post('/product' , async(req , res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct)
        res.send(result)
    })



    //users related database
  app.post('/users' , async(req, res) => {
    const newUser = req.body
    console.log(newUser);
    const result = await userCollection.insertOne(newUser)
    res.send(result)
  })
     






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/' , (req,res) => {
    res.send('coffee server is running')
})

app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
})

