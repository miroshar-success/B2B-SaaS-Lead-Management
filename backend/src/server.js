const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Import and use routes
const companyRoutes = require('./routes/company.routes');
const leadRoutes = require('./routes/lead.routes');

app.use('/api/companies', companyRoutes);
app.use('/api/leads', leadRoutes);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

