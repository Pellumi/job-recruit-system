import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { getAllUsersAdmin, deleteUser } from "../actions/AdminActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export const ViewAllUsersAdmin = () => {
  const { me } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const { loading, allUsers } = useSelector((state) => state.admin);
  const [allApplicants, setAllApplicants] = useState("");

  const [sideTog, setSideTog] = useState(false);

  useEffect(() => {
    dispatch(getAllUsersAdmin());
    setAllApplicants(allUsers);
  }, []);

  useEffect(() => {
    if (allUsers) {
      const searchArr = allUsers.filter((e) =>
        e.skills.some((skill) =>
          skill.trim().toLowerCase().includes(search.toLowerCase())
        )
      );

      if (search === "") {
        setAllApplicants(allUsers);
      } else {
        setAllApplicants(searchArr);
      }
    }
  }, [search, allUsers]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length !== 3) {
      return "Invalid date format";
    }

    const day = parts[2];
    const month = parts[1];
    const year = parts[0];

    return `${day}-${month}-${year}`;
  };

  const searchHandler = () => {
    console.log(search);

    const searchArr = allApplicants.filter((e) =>
      e.skills.some((skill) =>
        skill.trim().toLowerCase().includes(search.toLowerCase())
      )
    );

    if (search !== "") {
      setAllApplicants(searchArr);
    } else if (searchArr.length === 0) {
      setAllApplicants(allUsers);
    }
  };

  return (
    <>
      <MetaData title="All Users" />
      <div className="bg-gray-950 min-h-screen pt-14  md:px-20 px-3  text-white">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <div className="pt-1 fixed left-0 z-20 pl-0">
              <div
                onClick={() => setSideTog(!sideTog)}
                className="cursor-pointer blueCol px-3 py-2"
                size={44}
              >
                {!sideTog ? "Menu" : <RxCross1 />}
              </div>
            </div>

            <Sidebar sideTog={sideTog} />
            {me.role != "company" ? (
              <div>
                <p className="text-center pt-3 pb-4 text-3xl font-medium">
                  All Users
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between mx-auto">
                <p className="text-center pt-3 pb-4 text-3xl font-medium">
                  Applicants
                </p>
                <div className="flex  justify-end w-full  items-center  ">
                  <div className="bg-white flex sm:w-2/5 w-4/5">
                    <div className="flex justify-center items-center pl-2 text-black">
                      {" "}
                      <FiSearch size={19} />{" "}
                    </div>
                    <input
                      value={search}
                      placeholder="Search Jobs "
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
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
            )}

            {me.role != "company" ? (
              <div className="relative pb-24 overflow-x-auto shadow-md ">
                <table className="w-full text-sm text-left  text-white">
                  <thead className="text-xs text-gray-200 uppercase blueCol dark:text-gray-200">
                    <tr>
                      {/* <th scope="col" className="px-6 py-3">
                      User Id
                    </th> */}
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Created On
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers &&
                      allUsers
                        .filter((user) => user._id)
                        .sort((a, b) => {
                          const dateA = new Date(a.createdAt);
                          const dateB = new Date(b.createdAt);
                          return dateB - dateA;
                        })
                        .map((user, i) => (
                          <tr
                            key={i}
                            className=" border-b hover:bg-gray-900 bg-gray-950 border-gray-700"
                          >
                            {/* <th
                            scope="row"
                            className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                          >
                            {user._id}
                          </th> */}
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                              {convertDateFormat(user.createdAt.substr(0, 10))}
                            </td>
                            <td className="px-6 flex gap-4 md:pt-4 pt-6 py-4">
                              <Link
                                to={`/admin/user/role/${user._id}`}
                                className="text-blue-500 hover:text-blue-400 cursor-pointer flex justify-center items-center "
                              >
                                <MdOutlineModeEditOutline size={20} />
                              </Link>

                              <span
                                onClick={() => deleteUserHandler(user._id)}
                                className="text-red-500 hover:text-red-400 cursor-pointer flex justify-center items-center "
                              >
                                <AiOutlineDelete size={20} />
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="relative pb-24 overflow-x-auto shadow-md ">
                <table className="w-full text-sm text-left  text-white">
                  <thead className="text-xs text-gray-200 uppercase blueCol dark:text-gray-200">
                    <tr>
                      {/* <th scope="col" className="px-6 py-3">
                      User Id
                    </th> */}
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Skills
                      </th>
                      {/* <th scope="col" className="px-6 py-3">
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {allApplicants &&
                      allApplicants
                        .filter((user) => user._id)
                        .sort((a, b) => {
                          const dateA = new Date(a.createdAt);
                          const dateB = new Date(b.createdAt);
                          return dateB - dateA;
                        })
                        .map((user, i) => (
                          <tr
                            key={i}
                            className=" border-b hover:bg-gray-900 bg-gray-950 border-gray-700"
                          >
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">
                              <a href={`mailto:${user.email}`}>{user.email}</a>
                            </td>
                            <td className="px-6 py-4 flex">
                              <p>{user.skills.join(", ")}</p>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
