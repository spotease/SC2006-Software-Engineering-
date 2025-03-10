const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const cors = require('cors'); // Allow cross-origin requests

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS

const mongoUrl = "mongodb+srv://CJ_Admin:xcnQZiI5N4RlteOd@spoteasecluster0.fhyd7.mongodb.net/SpotEase_Auth?retryWrites=true&w=majority&appName=SpotEaseCluster0";

mongoose.connect(mongoUrl).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error:', err);
});

require('./UserDetails');
const User = mongoose.model('UserInfo');

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
