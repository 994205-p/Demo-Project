const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://testuser:testpass123@ac-vpkja-shard-00-00.vpkja.mongodb.net:27017,ac-vpkja-shard-00-01.vpkja.mongodb.net:27017,ac-vpkja-shard-00-02.vpkja.mongodb.net:27017/ecoscan?ssl=true&replicaSet=atlas-m0w0m3-shard-0&authSource=admin&retryWrites=true&w=majority';

// STABLE MOONGOOSE CONNECTION OPTIONS
const connectionOptions = {
  serverSelectionTimeoutMS: 30000, // Wait up to 30 seconds instead of dropping instantly
  socketTimeoutMS: 45000,          // Keep socket pipelines open longer
  family: 4                        // Force IPv4 addresses to match your network adapter
};

mongoose.connect(mongoURI, connectionOptions)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => mongoose.connect(mongoURI, connectionOptions).catch(() => {}), 5000);
  });

// Schema Blueprint
const FoodSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  donorName: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryTime: { type: String, required: true }
});
const FoodListing = mongoose.model('FoodListing', FoodSchema);

// API Operations
app.get('/api/food', async (req, res) => {
  try {
    const listings = await FoodListing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/food', async (req, res) => {
  try {
    const { itemName, donorName, quantity, expiryTime } = req.body;
    const newListing = new FoodListing({ itemName, donorName, quantity, expiryTime });
    await newListing.save();
    res.json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
