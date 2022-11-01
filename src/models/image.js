const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const path = require("path");

ImageSchema = new Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  imageURL: {type:String},
  public_id: {type:String},
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

/* ImageSchema.virtual("uniqueId").get(function () {
  return this.filename.replace(path.extname(this.filename), "");
}); */

module.exports = mongoose.model("Image", ImageSchema);
