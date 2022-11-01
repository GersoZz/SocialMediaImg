const mongoose = require("mongoose");

const { RS_MDB_HOST, RS_MDB_DATABASE } = process.env;
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://${RS_MDB_HOST}/${RS_MDB_DATABASE}`;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlparser: true,
  })
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.error(err));
