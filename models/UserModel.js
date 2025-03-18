const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.role !== "company"; // Required only for applicants/admins
    },
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Enter valid email address"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
  },

  role: {
    type: String,
    enum: ["applicant", "admin", "company"],
    default: "applicant",
  },

  avatar: {
    public_id: {
      type: String,
      required: function () {
        return this.role === "applicant" || this.role === "admin";
      },
    },
    url: {
      type: String,
      required: function () {
        return this.role === "applicant" || this.role === "admin";
      },
    },
  },

  skills: [
    {
      type: String,
    },
  ],

  resume: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],

  companyDetails: {
    description: { type: String },
    website: { type: String },
    location: { type: String },
    logo: {
      public_id: { type: String },
      url: { type: String },
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
