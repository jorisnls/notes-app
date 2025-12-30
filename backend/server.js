const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/health', (req, res) => {
    res.json({ message: 'OK' });
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});