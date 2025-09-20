require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Start server and sync database
async function startServer() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
}

startServer();