// Create Model & Schemma
import { Schema, model as Model } from "mongoose";
import { v4 as uuid } from "uuid";

// Schema or you can say type setting of objects
const mySchema = new Schema({
  _id: { type: String, default: uuid },
  g_id: { type: String, required: true, unique: true },
  creaedAt: { type: Date, default: Date.now },
  g_down: { type: String, required: true },
  title: { type: String, required: true },
  size: { type: String, required: true },
  quality: { type: String },
  format: { type: String },
  duration: { type: String }
  // user_id: {type: Schema.Types.ObjectId, ref: '', required: true}
});

mySchema.virtual("url").get(function() {
  return "/" + this._id;
});

export default Model("Link", mySchema);
