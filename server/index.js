const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// server-site
// eeGtAr14AFyWPSnw

const uri =
  "mongodb+srv://server-site:eeGtAr14AFyWPSnw@cluster0.zchez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("sample-users").collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post 
    app.post("/users", async (req, res) =>{
        const user = req.body;
        console.log(user)
        const result = await userCollection.insertOne(user);
        res.send(result);
    });

    // user find with id
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const user = await userCollection.findOne(query)
      res.send(user)
    });

    // PUT / Update
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = {_id : new ObjectId(id)}
      const option = {upsert : true};
      const updatedUser = {
        $set: {
          name : user.name,
          email : user.email,
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser, option)
      res.send(result)
    })

    // delete 
    app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await userCollection.deleteOne(query)
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send(`server is running on the PORT: ${port}`);
});

app.listen(port, () => {
  console.log(`successfully mongoDB Connected.... ${port}`);
});
