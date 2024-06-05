require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const dbConfig = require('./config/db.config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    console.log(MONGODB_URI);
  });

// Import and use routes
const companyRoutes = require('./routes/company.routes');
const leadRoutes = require('./routes/lead.routes');
const usersRouter = require('./routes/user.routes');


app.use('/api/companies', companyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', usersRouter);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

