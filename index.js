require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors middleware
const db = require('./models'); // Import the db object from models/index.js
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 8001;

app.use(cors()); // Use cors middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Start server and sync database
async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await db.sequelize.sync({ alter: true }); 
      console.log('All models were synchronized successfully.');
    }
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
}

startServer();