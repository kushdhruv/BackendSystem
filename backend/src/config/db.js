const mongoose = require('mongoose');
const { sequelize } = require('../models/User');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL Connected`);

    // Sync PostgreSQL models
    await sequelize.sync();
    console.log(`✅ PostgreSQL Models Synced`);

  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
