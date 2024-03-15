import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = process.env.MONGO_URL;
const client = new MongoClient(mongoUrl);

client.connect()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

app.get('/create', async (req, res) => {
  const { uid, code } = req.query;
  const db = client.db('stream');

  try {
    await db.collection('codes').insertOne({ uid, code });
    res.json({ code: 200 });
  } catch (err) {
    console.error('Error creating record:', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

app.get('/delete', async (req, res) => {
  const { uid } = req.query;
  const db = client.db('stream');

  try {
    await db.collection('codes').deleteOne({ uid });
    res.json({ code: 200 });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.get('/cast', async (req, res) => {
  const { uid } = req.query;
  const db = client.db('stream');

  try {
    const result = await db.collection('codes').findOne({ uid });
    if (result) {
      res.json({ code: 200, data: result.code });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (err) {
    console.error('Error retrieving record:', err);
    res.status(500).json({ error: 'Failed to retrieve record' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
