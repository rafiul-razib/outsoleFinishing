const express = require ("express");
const cors = require ("cors")
const { MongoClient } = require('mongodb');
const fileUpload = require ("express-fileupload");
const ObjectId = require ('mongodb').ObjectId;

const app = express()

const port = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9gfgt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log("database connected")
      const database = client.db("outsoleFinishing");
      const recipeCollection = database.collection("recipe");
      // create a document to insert

    //   POST Recipe

    app.post('/add-recipe', async(req, res)=>{
        const last = req.body.last;
        const art = req.body.art;
        const customer = req.body.customer;
        const finishing = req.body.finishing;
        const manpower = req.body.manpower;

        const pic = req.files.image;
        const picData = pic.data;
        const encodedPic = picData.toString('base64');
        const imageBuffer = Buffer.from(encodedPic, 'base64');

        const outsoleRecipe = {
            last,
            art,
            customer,
            finishing,
            manpower,
            imageBuffer
        }

        const result = await recipeCollection.insertOne(outsoleRecipe);
        res.json(result)
    })

    // GET recipe

    app.get('/recipe', async(req, res)=>{
        const cursor = recipeCollection.find({});
        const result = await cursor.toArray();
        res.json(result)
    })

    // GET recipe by id

    app.get('/recipe/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await recipeCollection.findOne(query);
        res.json(result)
    })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("hello component!!")
})

app.listen(port, ()=>{
    console.log("Listening to the port", port)
})