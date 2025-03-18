import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import {
  MdOutlineLocationOn,
  MdOutlineFeaturedPlayList,
  MdOutlineWorkOutline,
  MdWorkspacesOutline,
  MdAttachMoney,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { BiImageAlt } from "react-icons/bi";
import { TbLoader2 } from "react-icons/tb";
import { BiBuilding } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { createJobPost } from "../actions/JobActions";
import { RxCross1 } from "react-icons/rx";
import { FiLink } from "react-icons/fi";

export const CreateJob = () => {
  const { loading } = useSelector((state) => state.job);
  const { me } = useSelector((state) => state.user);

  const [sideTog, setSideTog] = useState(false);

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState(
    me.role === "company" ? me.name : ""
  );
  const [location, setLocation] = useState(
    me.role === "company" ? me.companyDetails.location : ""
  );
  const [skillsRequired, setSkillsRequired] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [interviewFormUrl, setInterviewFormUrl] = useState("");
  const [interviewFormDescription, setInterviewFormDescription] = useState("");
  const [category, setCategory] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [logo, setLogo] = useState("");
  const [logoName, setLogoName] = useState("");

  const logoChange = (e) => {
    if (e.target.name === "logo") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setLogo(reader.result);
          setLogoName(e.target.files[0].name);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const postHandler = (e) => {
    e.preventDefault();
    const skillsArr = skillsRequired.split(",");
    const data = {
      title,
      description,
      companyName,
      location,
      logo,
      skillsRequired: skillsArr,
      interviewFormUrl,
      interviewFormDescription,
      experience,
      salary,
      category,
      employmentType,
    };

    dispatch(createJobPost(data));

    setTitle("");
    setDescription("");
    setCompanyName(me.role === "company" ? me.name : "");
    setLocation(me.role === "company" ? me.companyDetails.location : "");
    setSalary("");
    setExperience("");
    setSkillsRequired("");
    setInterviewFormUrl("");
    setInterviewFormDescription("");
    setCategory("");
    setEmploymentType("");
    setLogo("");
    setLogoName("");
  };

  return (
    <>
      <MetaData title="Post Job" />
      <div className="bg-gray-950 min-h-screen pt-12  md:px-20 px-3  text-white">
        <div className="pt-4 fixed left-0 z-20 pl-0">
          <div
            onClick={() => setSideTog(!sideTog)}
            className="cursor-pointer blueCol px-3 py-2"
            size={44}
          >
            {!sideTog ? "Menu" : <RxCross1 />}
          </div>
        </div>

        <Sidebar sideTog={sideTog} />

        <div className=" flex justify-center w-full items-start pt-6">
          <form
            onSubmit={postHandler}
            className="md:flex hidden w-full max-w-5xl mx-auto rounded-lg shadow-lg p-6 space-y-6"
          >
            <div className="flex flex-col w-full gap-6">
              <h1 className="text-3xl font-bold pb-3 border-b text-gray-300">
                Post Job
              </h1>

              {/* First row */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Job Title */}
                <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="text-gray-500 px-3">
                    <MdOutlineWorkOutline size={20} />
                  </div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Job Title"
                    type="text"
                    className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                  />
                </div>

                {/* Company Name */}
                <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="text-gray-500 px-3">
                    <BiBuilding size={20} />
                  </div>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={me.role === "company"}
                    placeholder="Company Name"
                    type="text"
                    className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                  />
                </div>

                {/* Company Logo */}
                {me.role != "company" && (
                  <div className="bg-white rounded-md shadow-sm border border-gray-200 hover:border-blue-500 transition-all">
                    <div className="flex items-center">
                      <div className="text-gray-500 px-3">
                        {logo.length !== 0 ? (
                          <img
                            src={logo || "/placeholder.svg"}
                            className="w-8 h-8 object-contain"
                            alt="Company logo"
                          />
                        ) : (
                          <BiImageAlt size={20} />
                        )}
                      </div>
                      <label
                        htmlFor="logo"
                        className="outline-none w-full cursor-pointer text-gray-800 px-2 py-3 truncate"
                      >
                        {logoName.length === 0 ? (
                          <span className="text-gray-500">
                            Select Company Logo...
                          </span>
                        ) : (
                          logoName
                        )}
                      </label>
                      <input
                        id="logo"
                        name="logo"
                        required
                        onChange={logoChange}
                        accept="image/*"
                        type="file"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Second row */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Experience */}
                <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="text-gray-500 px-3">
                    <MdOutlineReceiptLong size={20} />
                  </div>
                  <input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    placeholder="Experience"
                    type="text"
                    className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                  />
                </div>

                {/* Location */}
                <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="text-gray-500 px-3">
                    <MdOutlineLocationOn size={20} />
                  </div>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    disabled={me.role === "company"}
                    placeholder="Location"
                    type="text"
                    className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                  />
                </div>

                {/* Salary */}
                <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="text-gray-500 px-3">
                    <MdAttachMoney size={20} />
                  </div>
                  <input
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                    placeholder="Salary"
                    type="text"
                    className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Job Description */}
                <div className="bg-white rounded-md shadow-sm flex border md:col-span-2 border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <div className="text-gray-500 px-3 pt-3">
                    <MdOutlineFeaturedPlayList size={20} />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Job Description"
                    className="outline-none w-full text-gray-800 px-2 py-3 min-h-[120px] rounded-r-md resize-y"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <div className="text-gray-500 px-3">
                      <FiLink size={20} />
                    </div>
                    <input
                      value={interviewFormUrl}
                      onChange={(e) => setInterviewFormUrl(e.target.value)}
                      required
                      placeholder="Interview Form Url"
                      type="text"
                      className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                    />
                  </div>
                  <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <div className="text-gray-500 px-3">
                      <MdOutlineFeaturedPlayList size={20} />
                    </div>
                    <input
                      value={interviewFormDescription}
                      onChange={(e) =>
                        setInterviewFormDescription(e.target.value)
                      }
                      required
                      placeholder="Interview From Description"
                      type="text"
                      className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              <div className="bg-white rounded-md shadow-sm flex border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <div className="text-gray-500 px-3 pt-3">
                  <MdWorkspacesOutline size={20} />
                </div>
                <textarea
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="Required Skills"
                  className="outline-none w-full text-gray-800 px-2 py-3 min-h-[120px] rounded-r-md resize-y"
                />
              </div>

              {/* Category and Employment Type */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <select
                    required
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className="block w-full px-4 py-3 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <select
                    required
                    onChange={(e) => setEmploymentType(e.target.value)}
                    value={employmentType}
                    className="block w-full px-4 py-3 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-3 transition-colors duration-200 flex items-center justify-center w-full md:w-auto"
                >
                  {loading ? (
                    <TbLoader2 className="animate-spin mr-2" size={24} />
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </div>
          </form>

          <form
            onSubmit={postHandler}
            className=" md:hidden flex md:w-1/3 shadow-gray-700  w-full md:mx-0 mx-8"
            action=""
          >
            <div className="md:px-10 px-2 pt-4 pb-20 w-full flex flex-col gap-4">
              <div className="text-center border-gray-500 border-b">
                <p className="text-4xl  font-medium">Post Job</p>
              </div>

              {/* Job Title */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 px-2">
                  <MdOutlineWorkOutline size={20} />
                </div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Job Title"
                  type="text"
                  className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                />
              </div>

              {/* Job Description */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 md:pb-12 pb-8 px-2">
                  <MdOutlineFeaturedPlayList size={20} />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Job Description"
                  type="text"
                  className="outline-none w-full text-black bold-placeholder px-1 pr-3 py-2"
                />
              </div>

              {/* Company Name */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 px-2">
                  <BiBuilding size={20} />
                </div>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="Company Name"
                  type="text"
                  disabled={me.role === "company"}
                  className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                />
              </div>

              {/* Company Logo */}
              {me.role != "company" && (
                <div>
                  <div className="bg-white flex justify-center items-center">
                    <div className="text-gray-600 px-2">
                      {logo.length !== 0 ? (
                        <img src={logo} className="w-[3em]" alt="" />
                      ) : (
                        <BiImageAlt size={20} />
                      )}
                    </div>
                    <label
                      htmlFor="logo"
                      className="outline-none w-full cursor-pointer text-black px-1 pr-3 py-2 "
                    >
                      {logoName.length === 0 ? (
                        <span className="text-gray-500 font-medium">
                          Select Company Logo...
                        </span>
                      ) : (
                        logoName
                      )}
                    </label>
                    <input
                      id="logo"
                      name="logo"
                      required
                      onChange={logoChange}
                      placeholder="Logo"
                      accept="image/*"
                      type="file"
                      className="outline-none  w-full hidden text-black px-1 pr-3 py-2"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <div className="text-gray-500 px-3">
                  <FiLink size={20} />
                </div>
                <input
                  value={interviewFormUrl}
                  onChange={(e) => setInterviewFormUrl(e.target.value)}
                  required
                  placeholder="Interview Form Url"
                  type="text"
                  className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                />
              </div>
              <div className="bg-white rounded-md shadow-sm flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <div className="text-gray-500 px-3">
                  <MdOutlineFeaturedPlayList size={20} />
                </div>
                <input
                  value={interviewFormDescription}
                  onChange={(e) => setInterviewFormDescription(e.target.value)}
                  required
                  placeholder="Interview From Description"
                  type="text"
                  className="outline-none w-full text-gray-800 px-2 py-3 rounded-r-md"
                />
              </div>

              {/* Location */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 px-2">
                  <MdOutlineLocationOn size={20} />
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Location"
                  type="text"
                  disabled={me.role === "company"}
                  className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                />
              </div>

              {/* Skills Required */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 md:pb-12 pb-8 px-2">
                  <MdWorkspacesOutline size={20} />
                </div>
                <textarea
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  placeholder="Required Skills"
                  type="text"
                  className="outline-none w-full text-black bold-placeholder px-1 pr-3 py-2"
                />
              </div>

              {/* Experience */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 px-2">
                  <MdOutlineReceiptLong size={20} />
                </div>
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  placeholder="Experience"
                  type="text"
                  className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                />
              </div>

              {/* Category */}
              <div className="bg-white flex justify-center items-center">
                <select
                  required
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  name=""
                  id="large"
                  className="block w-full px-6 py-2 text-base text-gray-900 border border-gray-300  bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 "
                >
                  <option selected value="">
                    Select Category
                  </option>
                  <option value="full-time">Technology</option>
                  <option value="part-time">Marketing</option>
                  <option value="contract">Finance</option>
                  <option value="internship">Sales</option>
                  <option value="internship">Legal</option>
                </select>
              </div>

              {/* Salary */}
              <div className="bg-white flex justify-center items-center">
                <div className="text-gray-600 px-2">
                  <MdAttachMoney size={20} />
                </div>

                <input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  placeholder="Salary"
                  type="text"
                  className="outline-none bold-placeholder w-full text-black px-1 pr-3 py-2"
                />
              </div>

              {/* Employment Type */}
              <div className="bg-white flex justify-center items-center">
                <select
                  required
                  onChange={(e) => setEmploymentType(e.target.value)}
                  value={employmentType}
                  name=""
                  id="large"
                  className="block w-full px-6 py-2 text-base text-gray-900 border border-gray-300  bg-gray-50 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 "
                >
                  <option selected value="">
                    Select Employment Type
                  </option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <button
                  disabled={loading}
                  className="blueCol flex justify-center items-center px-8 w-full py-2 font-semibold"
                >
                  {loading ? (
                    <TbLoader2 className="animate-spin" size={24} />
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
