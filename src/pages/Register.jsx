import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import {
  AiOutlineMail,
  AiOutlineUnlock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { MdPermIdentity, MdOutlineFeaturedPlayList } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";
import { CgProfile, CgWebsite } from "react-icons/cg";
import { GrLocation } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { TbFileDescription, TbLoader2 } from "react-icons/tb";
import { registerUser } from "../actions/UserActions";
import { useDispatch, useSelector } from "react-redux";

export const Register = () => {
  const { loading, isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("user");

  const [eyeTog, setEyeTog] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");

  const [avatar, setAvatar] = useState("");
  const [avatarName, setAvatarName] = useState("");

  const [resume, setResume] = useState("");
  const [resumeName, setResumeName] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [companyLogo, setCompanyLogo] = useState("");
  const [companyLogoName, setCompanyLogoName] = useState("");

  const avatarChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setAvatarName(e.target.files[0].name);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const resumeChange = (e) => {
    if (e.target.name === "resume") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setResume(reader.result);
          setResumeName(e.target.files[0].name);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const companyLogoChange = (e) => {
    if (e.target.name === "companyLogo") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCompanyLogo(reader.result);
          setCompanyLogoName(e.target.files[0].name);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const registerHandler = (e) => {
    e.preventDefault();

    const skillsArr = skills.split(",");
    const data = {
      name,
      email,
      password,
      avatar,
      resume,
      skills: skillsArr,
    };

    dispatch(registerUser(data));

    setName("");
    setEmail("");
    setPassword("");
    setAvatar("");
    setAvatarName("");
    setResume("");
    setResumeName("");
    setSkills("");
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  return (
    <>
      <MetaData title="Register" />
      <div className="bg-gray-950 min-h-screen pt-14 md:px-20 px-3  text-white">
        <div className="flex flex-col justify-center w-full items-center pt-6">
          {/* Tab Switcher */}
          <div className="flex w-full mb-4 mx-auto max-w-xl">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`flex-1 py-2 font-medium ${
                activeTab === "user" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`flex-1 py-2 font-medium ${
                activeTab === "company" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Company
            </button>
          </div>

          {activeTab === "user" ? (
            <div className="flex flex-col justify-center w-full items-center">
              <form
                onSubmit={registerHandler}
                className="flex flex-col md:w-1/2 shadow-gray-700 w-full md:mx-0 mx-8"
                action=""
              >
                <div className="md:px-10 px-2 pt-4 pb-20 w-full flex flex-col gap-4">
                  <div className="text-center">
                    <p className="text-4xl  font-medium">Register as a user</p>
                  </div>

                  {/* Name */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <MdPermIdentity size={20} />
                    </div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Full name"
                      type="text"
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Mail */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <AiOutlineMail size={20} />
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email"
                      type="email"
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Password */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <AiOutlineUnlock size={20} />
                    </div>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                      type={eyeTog ? "text" : "password"}
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                    <div className="text-gray-600 px-2 cursor-pointer">
                      {eyeTog ? (
                        <AiOutlineEye
                          size={20}
                          onClick={() => setEyeTog(!eyeTog)}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          size={20}
                          onClick={() => setEyeTog(!eyeTog)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Profile */}
                  <div>
                    <div className="bg-white flex justify-center items-center">
                      <div className="text-gray-600 px-2">
                        {avatar.length === 0 ? (
                          <CgProfile size={20} />
                        ) : (
                          <img src={avatar} className="w-[3em] h-[2.5em]" />
                        )}
                      </div>
                      <label
                        htmlFor="avatar"
                        className="outline-none w-full cursor-pointer text-black px-1 pr-3 py-2 "
                      >
                        {avatarName.length === 0 ? (
                          <span className="text-gray-500 font-medium">
                            Select Profile Pic...
                          </span>
                        ) : (
                          avatarName
                        )}
                      </label>
                      <input
                        id="avatar"
                        name="avatar"
                        required
                        onChange={avatarChange}
                        placeholder="Profile"
                        accept="image/*"
                        type="file"
                        className="outline-none  w-full hidden text-black px-1 pr-3 py-2"
                      />
                    </div>
                    <p className="bg-gray-950 text-white text-xs">
                      Please select Image file
                    </p>
                  </div>

                  {/* Resume */}
                  <div>
                    <div className="bg-white flex justify-center items-center">
                      <div className="text-gray-600 px-2">
                        <BsFileEarmarkText size={20} />
                      </div>
                      <label
                        className="outline-none w-full text-black px-1 pr-3 py-2"
                        htmlFor="resume"
                      >
                        {resumeName.length === 0 ? (
                          <span className="text-gray-500 cursor-pointer font-medium">
                            Select Resume...
                          </span>
                        ) : (
                          resumeName
                        )}
                      </label>
                      <input
                        required
                        onChange={resumeChange}
                        placeholder="Resume"
                        id="resume"
                        name="resume"
                        accept="image/*"
                        type="file"
                        className="outline-none hidden w-full text-black px-1 pr-3 py-2"
                      />
                    </div>
                    <p className="bg-gray-950 text-white text-xs">
                      Please select Image file
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 md:pb-12 pb-8 px-2">
                      <MdOutlineFeaturedPlayList size={20} />
                    </div>
                    <textarea
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Skills"
                      type="text"
                      className="outline-none w-full text-black bold-placeholder px-1 pr-3 py-2"
                    />
                  </div>

                  <div>
                    <button
                      disabled={loading}
                      className="blueCol flex justify-center items-center px-8 w-full py-2 font-semibold"
                    >
                      {loading ? (
                        <TbLoader2 className="animate-spin" size={24} />
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>

                  <div className="text-center text-sm pt-2">
                    <p>
                      Already have a account,
                      <Link to="/login" className="text-yellow-400 underline">
                        Login
                      </Link>{" "}
                      here.{" "}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col justify-center w-full items-center">
              <form
                onSubmit={registerHandler}
                className="flex flex-col md:w-1/2 shadow-gray-700 w-full md:mx-0 mx-8"
                action=""
              >
                <div className="md:px-10 px-2 pt-4 pb-20 w-full flex flex-col gap-4">
                  <div className="text-center">
                    <p className="text-4xl  font-medium">Register a company</p>
                  </div>

                  {/* Name */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <MdPermIdentity size={20} />
                    </div>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="Company Name"
                      type="text"
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Mail */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <AiOutlineMail size={20} />
                    </div>
                    <input
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      required
                      placeholder="Company Email"
                      type="email"
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Password */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <AiOutlineUnlock size={20} />
                    </div>
                    <input
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      required
                      placeholder="Password"
                      type={eyeTog ? "text" : "password"}
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                    <div className="text-gray-600 px-2 cursor-pointer">
                      {eyeTog ? (
                        <AiOutlineEye
                          size={20}
                          onClick={() => setEyeTog(!eyeTog)}
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          size={20}
                          onClick={() => setEyeTog(!eyeTog)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white flex justify-center items-start">
                    <div className="text-gray-600 md:pb-12 md:pt-3 pb-8 px-2">
                      <TbFileDescription size={20} />
                    </div>
                    <textarea
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      placeholder="Company Description"
                      type="text"
                      className="outline-none w-full text-black bold-placeholder px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Location */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <GrLocation size={20} />
                    </div>
                    <input
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      required
                      placeholder="Company Location"
                      type="text"
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Website */}
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      <CgWebsite size={20} />
                    </div>
                    <input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      required
                      placeholder="Company Website"
                      type="text"
                      className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                    />
                  </div>

                  {/* Logo */}
                  <div>
                    <div className="bg-white flex justify-center items-center">
                      <div className="text-gray-600 px-2">
                        {companyLogo.length === 0 ? (
                          <CgProfile size={20} />
                        ) : (
                          <img src={companyLogo} className="w-[3em] h-[2.5em]" />
                        )}
                      </div>
                      <label
                        htmlFor="companyLogo"
                        className="outline-none w-full cursor-pointer text-black px-1 pr-3 py-2 "
                      >
                        {companyLogoName.length === 0 ? (
                          <span className="text-gray-500 font-medium">
                            Company Logo...
                          </span>
                        ) : (
                          companyLogoName
                        )}
                      </label>
                      <input
                        id="companyLogo"
                        name="companyLogo"
                        required
                        onChange={companyLogoChange}
                        placeholder="Profile"
                        accept="image/*"
                        type="file"
                        className="outline-none  w-full hidden text-black px-1 pr-3 py-2"
                      />
                    </div>
                    <p className="bg-gray-950 text-white text-xs">
                      Please select Image file
                    </p>
                  </div>

                  <div>
                    <button
                      disabled={loading}
                      className="blueCol flex justify-center items-center px-8 w-full py-2 font-semibold"
                    >
                      {loading ? (
                        <TbLoader2 className="animate-spin" size={24} />
                      ) : (
                        "Register Company"
                      )}
                    </button>
                  </div>

                  <div className="text-center text-sm pt-2">
                    <p>
                      Already have a account,
                      <Link to="/login" className="text-yellow-400 underline">
                        Login
                      </Link>{" "}
                      here.{" "}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
