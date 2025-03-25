const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const Application = require("../models/AppModel");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const { sendEmail } = require("../utils/EmailUtilities");

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

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

// Get all Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all users with the role of "applicant"
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await User.find({ role: "applicant" });

    res.status(200).json({
      success: true,
      applicants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    // Find only users with the role of 'company'
    const companies = await User.find({ role: "company" });

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID and ensure they have the role of "company"
    const company = await User.findOne({ _id: id, role: "company" });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found or user is not a company.",
      });
    }

    // Find all jobs posted by the company
    const jobs = await Job.find({ postedBy: id });

    res.status(200).json({
      success: true,
      company: {
        companyDetails: company.companyDetails,
        _id: company._id,
        name: company.name,
        email: company.email,
        jobs,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all applications
exports.getAllApp = async (req, res) => {
  try {
    const applications = await Application.find().populate("job applicant");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllCompanyApp = async (req, res) => {
  try {
    // Find all jobs posted by the authenticated company
    const jobsPostedByCompany = await Job.find({
      postedBy: req.user._id,
    }).select("_id");

    if (!jobsPostedByCompany.length) {
      res.status(200).json({
        success: true,
        applications: [],
      });
    }

    const jobIds = jobsPostedByCompany.map((job) => job._id);

    // Find applications linked to these jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    }).populate("job applicant");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    // Validate application ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // Find the application by ID
    const application = await Application.findById(req.params.id)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Debugging: Log the application object

    // Extract applicant ID directly (since it's already an ObjectId)
    const applicantId = application.applicant._id;
    if (!applicantId) {
      return res.status(400).json({
        success: false,
        message: "Applicant ID is missing",
      });
    }

    // Ensure the applicant exists
    const user = await User.findById(applicantId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const interviewFormUrl = application.job?.interviewForm?.url || null;
    const interviewFormDescription =
      application.job?.interviewForm?.description || null;

    // Update application status
    application.status = req.body.status;
    await application.save();

    if ((req.body.status = "interview")) {
      const emailContent = `
      <div style="font-family: Arial, sans-serif; text-align: left;">
        <p style="color: #0073E6; font-size: 24px;">Your application status for ${application.job.title} at ${application.job.companyName} has been updated to ${
          application.status
        }.</p>
        ${
          interviewFormUrl
            ? `<p><strong>Interview Form Link:</strong> <a href="${interviewFormUrl}">${interviewFormUrl}</a></p>`
            : ""
        }
        ${
          interviewFormDescription
            ? `<p><strong>Interview Meet Link:</strong> <a href="${interviewFormDescription}">${interviewFormDescription}</a></p>`
            : ""
        }
      </div>
    `;

      await sendEmail({
        to: user.email,
        subject: `JobLane Application Update`,
        html: emailContent,
      });
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; text-align: left;">
        <p style="color: #0073E6; font-size: 24px;">Your application status  for ${application.job.title} at ${application.job.companyName}  has been updated to ${application.status}.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: `JobLane Application Update`,
      html: emailContent,
    });

    res.status(200).json({
      success: true,
      message: "Application Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Get Application
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job applicant"
    );

    res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update User Role
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.role = req.body.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "User Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    const logoToDelete_Id = job.companyLogo.public_id;

    await cloudinary.v2.uploader.destroy(logoToDelete_Id);

    const logo = req.body.companyLogo;

    const myCloud = await cloudinary.v2.uploader.upload(logo, {
      folder: "logo",
      crop: "scale",
    });

    req.body.companyLogo = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Job Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

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

// Delete Single Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
