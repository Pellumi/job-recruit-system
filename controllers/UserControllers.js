const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/auth");
const cloudinary = require("cloudinary");
const { sendEmail } = require("../utils/EmailUtilities");

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar, skills, resume } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatar",
      crop: "scale",
    });

    const myCloud2 = await cloudinary.v2.uploader.upload(resume, {
      folder: "resume",
      crop: "fit",
    });

    const hashPass = await bcrypt.hash(password, 10);

    const emailContent = `
    <div style="font-family: Arial, sans-serif; text-align: left;">
    <p style="color: #0073E6; font-size: 24px;">Welcome to JobLane ${name}.</p>
    </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: `JobLane Application`,
        html: emailContent,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = await User.create({
      name,
      email,
      password: hashPass,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      skills,
      resume: {
        public_id: myCloud2.public_id,
        url: myCloud2.secure_url,
      },
    });

    const token = createToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: "User Created",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      description,
      location,
      website,
      logo,
    } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !email ||
      !password ||
      !description ||
      !location ||
      !logo
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields except website are required.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    // Upload company logo to Cloudinary
    const uploadedLogo = await cloudinary.v2.uploader.upload(logo, {
      folder: "company_logos",
      crop: "scale",
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailContent = `
    <div style="font-family: Arial, sans-serif; text-align: left;">
    <p style="color: #0073E6; font-size: 24px;">Welcome to JobLane ${companyName}.</p>
    </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: `JobLane Application`,
        html: emailContent,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // Create new company user
    const company = await User.create({
      name: companyName, // Store company name in name field
      email,
      password: hashedPassword,
      role: "company",
      companyDetails: {
        description,
        location,
        website: website || "",
        logo: {
          public_id: uploadedLogo.public_id,
          url: uploadedLogo.secure_url,
        },
      },
    });

    // Generate authentication token
    const token = createToken(company._id, company.email);

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = createToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: "User logged In Successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        isLogin: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        isLogin: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);

    const userPassword = user.password;

    const isMatch = await bcrypt.compare(oldPassword, userPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is wrong",
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is same as old Password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "New Pasword and Confirm Password are not matching",
      });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    user.password = hashPass;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User password changed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { newName, newEmail, newAvatar, newResume, newSkills } = req.body;

    const user = await User.findById(req.user._id);

    const avatarId = user.avatar.public_id;
    const resumeId = user.resume.public_id;

    await cloudinary.v2.uploader.destroy(avatarId);
    await cloudinary.v2.uploader.destroy(resumeId);

    const myCloud1 = await cloudinary.v2.uploader.upload(newAvatar, {
      folder: "avatar",
      crop: "scale",
    });

    const myCloud2 = await cloudinary.v2.uploader.upload(newResume, {
      folder: "resume",
      crop: "fit",
    });

    user.name = newName;
    user.email = newEmail;
    user.skills = newSkills;
    user.avatar = {
      public_id: myCloud1.public_id,
      url: myCloud1.secure_url,
    };
    user.resume = {
      public_id: myCloud2.public_id,
      url: myCloud2.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCompanyProfile = async (req, res) => {
  try {
    const {
      newCompanyName,
      newEmail,
      newLocation,
      newLogo,
      newDescription,
      newWebsite,
    } = req.body;

    const company = await User.findById(req.user._id);

    if (company.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only companies can update their profiles.",
      });
    }

    // Delete the old logo from Cloudinary
    if (company.companyDetails.logo.public_id) {
      await cloudinary.v2.uploader.destroy(
        company.companyDetails.logo.public_id
      );
    }

    // Upload new logo to Cloudinary
    const uploadedLogo = await cloudinary.v2.uploader.upload(newLogo, {
      folder: "company_logos",
      crop: "scale",
    });

    // Update company details
    company.name = newCompanyName;
    company.email = newEmail;
    company.companyDetails.description = newDescription;
    company.companyDetails.location = newLocation;
    company.companyDetails.website = newWebsite;
    company.companyDetails.logo = {
      public_id: uploadedLogo.public_id,
      url: uploadedLogo.secure_url,
    };

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      await User.findByIdAndRemove(req.user._id);
    } else {
      return res.status(200).json({
        success: false,
        message: "Password does not match !",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
