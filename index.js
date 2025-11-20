const express = require('express');
const cors = require('cors');
//   cors por space ===>cant find cors showing ***

require('dotenv').config();
//  console.log(process.env.DB_USER);
//  console.log(process.env.DB_PASS);
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster09.ceody5c.mongodb.net/?appName=Cluster09`;

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
    await client.connect();

    const plantsCollection = client.db('plantDB').collection('plants')



    app.get('/plants', async (req, res) => {
      const result = await plantsCollection.find().toArray();
      res.send(result);
    })



    app.post('/plants', async (req, res) => {

      const newPlant = req.body;

      const result = await plantsCollection.insertOne(newPlant);
      res.send(result);
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }



  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {

  res.send('plant server is getting ready')

});

app.listen(port, () => {
  console.log(`plant server is running on port ${port}`);

})