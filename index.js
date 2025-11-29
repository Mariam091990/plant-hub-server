const express = require('express');
const cors = require('cors');


require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster09.ceody5c.mongodb.net/?appName=Cluster09`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
   

    const plantsCollection = client.db('plantDB').collection('plants')


    // read all data

    app.get('/plants', async (req, res) => {
      const result = await plantsCollection.find().toArray();
      res.send(result);
    })

    // read a specific data for update operation

    app.get("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const result = await plantsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })



    app.post('/plants', async (req, res) => {

      const newPlant = req.body;
      const result = await plantsCollection.insertOne(newPlant);
      res.send(result);
    })


    app.put('/plants/:id', async (req, res) => {

      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPlant = req.body;
      const updatedDoc = {
        $set: updatedPlant
      }

      

      const result = await plantsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);


    })


    app.delete('/plants/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await plantsCollection.deleteOne(query);
      res.send(result);

    })


    app.get("/plants", async (req, res) => {
      const sortBy = req.query.sortBy;

      let sortQuery = {};

      if (sortBy === "date") {
        sortQuery = { createdAt: -1 }; // newest first
      }

      const plants = await plantsCollection.find().sort(sortQuery).toArray();

      res.send(plants);
    });






    // Send a ping to confirm a successful connection
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }



  finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {

  res.send('plant server is getting ready')

});

app.listen(port, () => {
  console.log(`plant server is running on port ${port}`);

})