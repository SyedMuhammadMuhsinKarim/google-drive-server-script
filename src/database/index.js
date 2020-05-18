//Import the mongoose module
const mongoose = require("mongoose");
const mongoDB = process.env.MONGO;

const connect = () =>
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default connect;
