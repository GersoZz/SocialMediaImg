const mongoose = require("mongoose");

const { database } = require("./keys");

mongoose
  .connect(database.URI, {
    useNewUrlparser: true,
  })
  .then((db) => console.log("Db is connected"))
  .catch((err) => console.error(err));
