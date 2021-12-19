const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbtt2.mongodb.net/${process.env
.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(BodyParser.json());
const port = 8000
app.get('/', (req, res) => {
    res.send('Welcome to Medicrew server')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const appointmentCollection = client.db("medicrewbd").collection("appointments");
  


  app.post('/addAppointment', (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      appointmentCollection.insertOne(appointment)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  })

  


});
















app.listen(process.env.PORT || port) 