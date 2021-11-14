const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

connectDB();

app.use(express.json({extended: false}));
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hey!");
})

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../frontend/build'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
    )
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});