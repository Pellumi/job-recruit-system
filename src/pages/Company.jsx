import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyData } from "../actions/AdminActions";
import { Loader } from "../components/Loader";
import { useParams } from "react-router";
// import useIsMobile from "../hooks/useIsMobile";
import { RxCross2 } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import { JobCard } from "../components/JobCard";
import { getSingleJob } from "../actions/JobActions";

const Company = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  //   const isMobile = useIsMobile();
  const { loading, companyData } = useSelector((state) => state.admin);
  const [jobs, setJobs] = useState([]);
  const [baseJobs, setBaseJobs] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getCompanyData(id));
    console.log(companyData);
  }, []);

  useEffect(() => {
    setJobs(companyData.jobs);
    setBaseJobs(companyData.jobs);
  }, []);

  useEffect(() => {
    const searchArr = baseJobs.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase().trim())
    );

    if (search === "") {
      setJobs(baseJobs);
    } else {
      setJobs(searchArr);
    }
  }, [search, baseJobs]);

  const searchHandler = () => {
    console.log(search);

    const searchArr = companyData?.jobs.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );

    if (search !== "") {
      setJobs(searchArr);
    } else if (searchArr.length === 0) {
      setJobs(companyData?.jobs);
    }
  };

  const itemsPerPage = 5;

  const totalPageCount = Math.ceil(jobs.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPageCount));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedData = jobs.slice(startIndex, endIndex);

  const pageButtons = [];
  const maxButtonsToShow = 3;

  let startButton = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endButton = Math.min(totalPageCount, startButton + maxButtonsToShow - 1);

  for (let i = startButton; i <= endButton; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`mx-1 px-3 py-1 border border-gray-700 rounded ${
          currentPage === i
            ? "bg-gray-800  text-white"
            : "bg-gray-900  text-white hover:bg-gray-800 hover:text-white"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen pt-14 sm:px-20 px-3  text-white">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="p-6 flex w-full justify-center items-center gap-8">
            <a href={companyData.companyDetails.website} target="blank" className="w-60 h-60">
              <img
                src={companyData.companyDetails.logo.url}
                alt=""
                className="rounded-full w-60 h-60"
              />
            </a>
            <div className="flex flex-col gap-6">
              <div className="flex gap-8 items-center justify-start">
                <div className="">
                  <p className="md:text-xl pt-1 text-[#EAB308] text-lg">Name</p>
                  <p className="md:text-xl pt-1 text-lg">{companyData.name}</p>
                </div>
                <div className="">
                  <p className="md:text-xl pt-1 text-[#EAB308] text-lg">
                    Location
                  </p>
                  <p className="md:text-xl pt-1 text-lg">
                    {companyData.companyDetails.location}
                  </p>
                </div>
              </div>
              <div className="">
                <p className="md:text-xl pt-1 text-[#EAB308] text-lg">
                  Description
                </p>
                <p className="md:text-xl pt-1 text-lg max-w-xl">
                  {companyData.companyDetails.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-col flex justify-center items-center w-full ">
            <div className="text-center pt-8 sm:text-3xl text-2xl font-medium">
              <p>Company Jobs</p>
            </div>
            <div className="py-3 pt-4 w-full flex justify-center items-center">
              <div className="flex  justify-center w-full  items-center  ">
                <div className="bg-white flex sm:w-2/5 w-4/5">
                  <div className="flex justify-center items-center pl-2 text-black">
                    {" "}
                    <FiSearch size={19} />{" "}
                  </div>
                  <input
                    value={search}
                    placeholder="Search Jobs "
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="outline-none bold-placeholder   text-black px-2 pl-3 sm:h-10 w-full h-8 py-1 text-sm"
                  />
                  <div className="text-black items-center flex justify-center px-2 ">
                    <RxCross2
                      onClick={() => setSearch("")}
                      size={19}
                      className={`cursor-pointer
                          ${search.length !== 0 ? "flex" : "hidden"}
                           `}
                    />
                  </div>
                  <button
                    onClick={() => searchHandler()}
                    className="blueCol sm:text-sm text-xs px-4 sm:h-10 h-8 py-1"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className=" flex flex-col pt-1 justify-center sm:flex-row w-full ">
              <div className="sm:w-2/4 pb-20 pt-2">
                <div className="flex  flex-col sm:overflow-y-auto  sm:max-h-[30em] gap-4">
                  {jobs &&
                    displayedData
                      .filter((job) => job._id)
                      .sort((a, b) => {
                        const dateA = new Date(a.createdAt);
                        const dateB = new Date(b.createdAt);
                        return dateB - dateA;
                      })
                      .map((job, i) => (
                        <JobCard
                          onClick={() => {
                            dispatch(getSingleJob(job._id));
                          }}
                          key={i}
                          job={job}
                        />
                      ))}

                  <div
                    className={`${
                      jobs.length == 0 ? "flex" : "hidden"
                    }  w-full  justify-center items-center  text-center pt-16 pb-12 sm:text-xl text-lg    `}
                  >
                    No Jobs available according to your preferences
                  </div>
                </div>

                <div className={` justify-center pt-20 items-center`}>
                  <div className="flex  flex-col">
                    {/* Pagination */}
                    <div className="flex justify-center mt-1">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 mr-2"
                      >
                        Previous
                      </button>

                      {pageButtons}

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPageCount}
                        className="bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 ml-2"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Company;
