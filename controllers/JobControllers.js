const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      location,
      logo,
      skillsRequired,
      experience,
      salary,
      category,
      employmentType,
      interviewFormUrl, // Extract interview form URL
      interviewFormDescription, // Extract interview form description
    } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(logo, {
      folder: "logo",
      crop: "scale",
    });

    const company = await User.findById(req.user._id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const companyLogo = company.avatar;

    const newJob = await Job.create({
      title,
      description,
      companyName,
      companyLogo: {
        public_id: logo ? myCloud.public_id : companyLogo.public_id,
        url: logo ? myCloud.secure_url : companyLogo.url,
      },
      location,
      skillsRequired,
      experience,
      category,
      salary,
      employmentType,
      interviewForm: interviewFormUrl
        ? {
            url: interviewFormUrl,
            description: interviewFormDescription || "", // Default empty string if no description
          }
        : undefined, // Omit interviewForm if no URL is provided
      postedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Job created successfully",
      newJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.allJobs = async (req, res) => {
  try {
    const Jobs = await Job.find();

    res.status(200).json({
      success: true,
      Jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.oneJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy");

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const JobId = req.params.id;

    if (user.savedJobs.includes(JobId)) {
      const jobIdObjectId = new mongoose.Types.ObjectId(JobId);
      const arr = user.savedJobs.filter(
        (jobid) => jobid.toString() !== jobIdObjectId.toString()
      );

      user.savedJobs = arr;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Job UnSaved",
      });
    } else {
      const jobIdObjectId = new mongoose.Types.ObjectId(JobId);
      user.savedJobs.push(jobIdObjectId);
      await user.save();
      res.status(200).json({
        success: true,
        message: "Job saved",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");

    res.status(200).json({
      success: true,
      savedJob: user.savedJobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllJobsByCompany = async (req, res) => {
  try {
    const companyId = req.user.id;

    // Find jobs where `postedBy` matches the company's user ID
    const jobs = await Job.find({ postedBy: companyId });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
