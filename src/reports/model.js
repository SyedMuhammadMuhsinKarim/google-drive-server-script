import { Schema, model as Model } from "mongoose";
import { v4 as uuid } from "uuid";

// Schema or you can say type setting of objects
const mySchema = new Schema({
  _id: {
    type: String,
    default: uuid
  },
  creaedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  link_id: {
    type: Schema.Types.ObjectId,
    ref: "Link",
    required: true,
    unique: true
  }
});

mySchema.virtual("url").get(function() {
  return "/" + this._id;
});

export default Model("Report", mySchema);
