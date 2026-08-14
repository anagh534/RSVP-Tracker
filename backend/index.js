const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./models');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RSVP Tracker API' });
});

// Initialize database and start server
const startServer = async () => {
  // Add retry logic for database connection (important for Docker Compose)
  let retries = 5;
  while (retries > 0) {
    try {
      await syncDatabase();
      break;
    } catch (err) {
      console.log('Database sync failed, retrying...', retries);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

startServer();
