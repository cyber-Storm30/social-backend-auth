import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    req_sent_to: {
      type: Array,
      default: [],
    },
    req_received_from: {
      type: Array,
      default: [],
    },
    connections: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
