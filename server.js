const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Node.js path module

const app = express();
const PORT = process.env.PORT || 3001;

// Connection URL
const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'voting';

// Connect to MongoDB using mongoose
mongoose.connect(url + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const voteSchema = new mongoose.Schema({
    photoId: String,
    count: { type: Number, default: 0 }
});

const Vote = mongoose.model('Vote', voteSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/vote', async (req, res) => {
    const { photoId } = req.body;
    try {
        let vote = await Vote.findOne({ photoId });
        if (!vote) {
            vote = new Vote({ photoId });
        }
        vote.count++;
        await vote.save();
        res.status(200).json({ success: true, votes: vote.count }); // Return updated count
    } catch (error) {
        console.error('Error counting vote:', error);
        res.status(500).json({ success: false, message: 'Failed to count vote' });
    }
});

app.get('/results', async (req, res) => {
    try {
        const votes = await Vote.find();
        res.status(200).json({ success: true, votes });
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch votes' });
    }
});

// Catch-all route to serve index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
