const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connectToDatabase();

const db = client.db('mydatabase');
const collection = db.collection('mycollection');

app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Save metadata to MongoDB
    await collection.insertOne({
      filename: req.file.originalname,
      filePath: req.file.path
    });

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save file metadata' });
  }
});

app.post('/predict', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  // Implement prediction logic here using your Hugging Face model
  // Example code to send file to model and get prediction
  
  res.status(200).json({ prediction: 'dummy prediction' });
});

app.get('/data', async (req, res) => {
  try {
    const documents = await collection.find().toArray();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
