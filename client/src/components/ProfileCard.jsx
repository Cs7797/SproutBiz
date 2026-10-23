/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ProfilePic from "../assets/profile.avif";
import {  useState } from "react";
import { MdVerified } from "react-icons/md";

const ProfileCard = ({ item }) => {
  const [error, setError] = useState(null);
  const [profileItem, setProfileItem] = useState(item);
  const handleVerifyClick = async () => {
    try {
      const res = await fetch(`/api/admin/verify/${item._id}`);
      const verified = await res.json();
      if (verified.success == false) {
        setError(verified.message);
      } else {
        setProfileItem(verified)
      }
    } catch (error) {
      setError(error);
    }
  };

  console.log(error);
  return (
    <div>
      <div className="w-full px-4  pt-2 max-w-sm bg-gray-200 text-black border border-gray-200 rounded-lg shadow ">
        <div className="flex flex-col items-center pb-4">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={ProfilePic}
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl flex items-center font-medium text-gray-900 ">
            {profileItem.userName}{profileItem.isVarified?<MdVerified className="text-blue-600"/>:""}
          </h5>
          <span className="text-sm ">{profileItem.email}</span>
          <div className="">
            <div className="flex mt-4 md:mt-6">
              <Link
                to={`/getProfile/${profileItem._id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                View Profile
              </Link>
              <button
                disabled={profileItem.varificationDocURL == ""}
                style={{
                  cursor:
                  profileItem.varificationDocURL == "" ? "not-allowed" : "pointer",
                }}
                title={
                  profileItem.varificationDocURL == ""
                    ? "They haven't submitted any document"
                    : ""
                }
                onClick={handleVerifyClick}
                className={`py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 ${
                  profileItem.varificationDocURL == ""
                    ? "dark:bg-gray-600"
                    : "dark:bg-gray-800"
                }  dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
              >
                {profileItem.isVarified ? "Varified" : "Verify"}
              </button>
            </div>
            <div className="">
              <Link
                to={profileItem.varificationDocURL}
                disabled={!profileItem.varificationDocURL}
                style={{
                  cursor:
                  profileItem.varificationDocURL == "" ? "not-allowed" : "pointer",
                }}
                className={`inline-flex w-full justify-center items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ${
                  profileItem.varificationDocURL == ""
                    ? "dark:bg-green-800"
                    : "dark:bg-green-600"
                } mt-2  dark:hover:bg-green-700 dark:focus:ring-blue-80`}
              >
                View Document
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
