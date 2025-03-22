const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const cors = require('cors'); // Allow cross-origin requests
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS

//const mongoUrl = process.env.MONGO_Auth_URL; // Load MongoDB URL from environment variables
const mongoURI = 'mongodb+srv://:@clustername.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error:', err);
});

// Require schema models
require('./UserDetails');
require('./LocationDetails'); // Add this line to include the Location schema

const User = mongoose.model('UserInfo');
const Location = mongoose.model('LocationHistory'); // Add this line for the Location model

app.get('/', (req, res) => {
  res.send({ status: "started" });
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.send({ data: "User already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    await User.create({
      email: email,
      password: hashedPassword // Store hashed password instead of plaintext
    });
    res.send({ status: "User registered" });
  } catch (error) {
    res.send({ status: "Error", data: error });
  }
});

// New endpoint to save location
app.post('/save-location', async (req, res) => {
  try {
    const { userId, coordinates, locationName, locationType } = req.body;
    
    if (!userId || !coordinates || !coordinates.latitude || !coordinates.longitude) {
      return res.status(400).send({ status: "Error", message: "Missing required fields" });
    }
    
    const newLocation = await Location.create({
      userId,
      coordinates,
      locationName: locationName || '',
      locationType: locationType || '',
      timestamp: new Date()
    });
    
    res.send({ status: "Success", data: newLocation });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).send({ status: "Error", message: error.message });
  }
});

// Endpoint to get location history for a user
app.get('/location-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;
    
    const locations = await Location.find({ userId })
      .sort({ timestamp: -1 })
      .skip(Number(skip))
      .limit(Number(limit));
      
    res.send({ status: "Success", data: locations });
  } catch (error) {
    console.error('Error getting location history:', error);
    res.status(500).send({ status: "Error", message: error.message });
  }
});

// Endpoint to clear location history for a user
app.delete('/location-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Location.deleteMany({ userId });
    
    res.send({ status: "Success", deleted: result.deletedCount });
  } catch (error) {
    console.error('Error clearing location history:', error);
    res.status(500).send({ status: "Error", message: error.message });
  }
});