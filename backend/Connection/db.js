const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString)
  .then(() => {
    console.log("WattWise-server successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connection failed...");
    console.log(error);
  });