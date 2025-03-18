const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyLogo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  location: {
    type: String,
    required: true,
  },
  skillsRequired: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
    default: "full-time",
  },
  experience: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  interviewForm: {
    url: {
      type: String,
      required: false, // Only required if the company wants an interview form
      validate: {
        validator: function (v) {
          return !v || v.startsWith("https://"); // Ensure it's a valid URL
        },
        message: "Please enter a valid URL",
      },
    },
    description: {
      type: String,
      required: false, // Optional explanation about the interview form
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
