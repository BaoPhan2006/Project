const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "closed"],
      default: "active"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);