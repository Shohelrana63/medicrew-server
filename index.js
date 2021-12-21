const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const fileUpload = require('express-fileupload');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbtt2.mongodb.net/${process.env
.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(fileUpload());
const port = 8000
app.get('/', (req, res) => {
    res.send('Welcome to Medicrew server')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const appointmentCollection = client.db("medicrewbd").collection("appointments");
  const doctorCollection = client.db("medicrewbd").collection("doctors");


  app.post('/addAppointment', (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      appointmentCollection.insertOne(appointment)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  })


// Get all Booked Appointments
    app.get('/bookedAppointments', (req, res) => {
        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

//Add a new doctor
app.post('/addADoctor', (req, res) => {
    const file = req.files.file;
    const id = req.body.id;
    const category = req.body.category;
    const name = req.body.name;
    const education = req.body.education;
    const designation = req.body.designation;
    const department = req.body.department;
    const hospital = req.body.hospital;
    const img = req.body.img;

    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
 console.log(id, category, name, education, designation, department, hospital, img, image);
    doctorCollection
        .insertOne({ id, category, name, education, designation, department, hospital, img, image })
        .then((result) => {
            res.send(result.insertedCount > 0);
        });
});

});
















app.listen(process.env.PORT || port) 