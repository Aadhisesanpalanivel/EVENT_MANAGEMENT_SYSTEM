const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      
    },
    description: {
      type: String,
      
    },
    date: {
      type: Date,
      
    },
    time: {
      type: String,
      
    },
    location: {
      type: String,
    },
    category: {
      type: String,
      enum: ["Conference", "Workshop", "Seminar", "Social", "Other"],
    },
    capacity: {
      type: Number,
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
      
    image: {
      type: String,
      default: "/default-event-image.jpg",
    },
  },
 
);

// Virtual for available spots
eventSchema.virtual("availableSpots").get(function () {
  return this.capacity - this.registeredParticipants.length;
});

// Virtual for whether event is full
eventSchema.virtual("isFull").get(function () {
  return this.registeredParticipants.length >= this.capacity;
});

// Method to check if a user is registered
eventSchema.methods.isUserRegistered = function (userId) {
  return this.registeredParticipants.some(
    (p) => p.user.toString() === userId.toString()
  );
};

// Pre-save middleware to update status based on date
eventSchema.pre("save", function (next) {
  const now = new Date();
  const eventDate = new Date(this.date);

  if (this.status !== "cancelled") {
    if (eventDate < now) {
      this.status = "completed";
    } else if (eventDate.toDateString() === now.toDateString()) {
      this.status = "ongoing";
    } else {
      this.status = "upcoming";
    }
  }

  next();
});

// Index for search functionality
eventSchema.index({
  title: "text",
  description: "text",
  location: "text",
  tags: "text",
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
