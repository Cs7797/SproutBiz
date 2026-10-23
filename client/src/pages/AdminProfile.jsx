import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import CampaignCard from "../components/CampaignCard";
import ProfileCard from "../components/ProfileCard";

const AdminProfile = () => {
  const [data, setData] = useState({
    users: null,
    campaigns: null,
    error: null,
  });
  const [active, setActive] = useState(0);
  const [displayData, setDisplayData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, campaignRes] = await Promise.all([
          fetch("api/admin/allUsers"),
          fetch("api/admin/allCampaigns"),
        ]);

        const [userData, campaignData] = await Promise.all([
          userRes.json(),
          campaignRes.json(),
        ]);

        if (userData.success === false) {
          setData((prevData) => ({ ...prevData, error: userData.message }));
        } else {
          setData((prevData) => ({ ...prevData, users: userData }));
        }

        if (campaignData.success === false) {
          setData((prevData) => ({ ...prevData, error: campaignData.message }));
        } else {
          setData((prevData) => ({ ...prevData, campaigns: campaignData }));
          setDisplayData(campaignData);
        }
      } catch (error) {
        setData((prevData) => ({ ...prevData, error: error.message }));
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (index) => {
    setActive(index);
    if (index == 0) setDisplayData(data.campaigns);
    else if (index == 1) setDisplayData(data.users);
    else if (index == 2)
      setDisplayData(data.users.filter((item) => item.invested.length > 0));
    else if (index == 3)
      setDisplayData(data.users.filter((item) => item.champaigns.length > 0));
    else if (index == 4)
      setDisplayData(
        data.campaigns.filter(
          (item) => item.amountGained == item.amountRequired,
        ),
      );
    else if (index == 5)
      setDisplayData(data.campaigns.filter((item) => item.amountGained == 0));
    else if (index == 6)
      setDisplayData(data.users.filter((item) => item.isVarified == true));
    else if (index == 7)
      setDisplayData(data.users.filter((item) => item.isVarified == false));
    else if (index == 8)
      setDisplayData(
        data.users.filter(
          (item) => item.isVarified == false && item.varificationDocURL != "",
        ),
      );
  };
  console.log(displayData);

  const { users, campaigns, error } = data;

  if (!users && !campaigns) return <Loader />;

  return (
    <div className="flex">
      <div className="sidebar-container w-1/4 md:relative">
        <div className="flex flex-col md:sticky md:top-0">
          {[
            "All Campaigns",
            "All Users",
            "All Investors",
            "All Entrepreneurs",
            "Completed Campaigns",
            "Zero Amount Gained Campaigns",
            "All Verified Users",
            "All Non Verified Users",
            "Verification Requests",
          ].map((label, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(index)}
              className={`btn ${active === index ? "btn-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-3/4">
        <div className="font-bold text-4xl capitalize text-center py-8">
          {active == 0
            ? "All Campaigns"
            : active == 1
              ? "All Users"
              : active == 2
                ? "All investors"
                : active == 3
                  ? "All Entreprenuers"
                  : active == 4
                    ? "Completed Camapigns"
                    : active == 5
                      ? "Zero amount gained Campaigns"
                      : active == 6
                        ? "Verified Users"
                        : active == 7
                          ? " Non Verified Users"
                          : active == 8
                            ? "Verification Requests"
                            : ""}
        </div>
        <div>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="">
              {active === 0 || active == 4 || active == 5 ? (
                displayData.length > 0 ? (
                  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-y-2  gap-1 px-4 justify-items-center">
                    {displayData.map((item) => (
                      <div key={item._id} className="">
                        <CampaignCard item={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <h1 className="text-4xl font-bold text-center mt-10">
                    No such data...
                  </h1>
                )
              ) : active == 1 ||
                active == 2 ||
                active == 3 ||
                active == 6 ||
                active == 7 ||
                active == 8 ? (
                displayData.length > 0 ? (
                  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-2  gap-1 px-4 justify-items-center">
                    {displayData.map((item) => (
                      <div key={item._id} className="">
                        <ProfileCard item={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <h1 className="text-4xl font-bold text-center mt-10">
                    No such data...
                  </h1>
                )
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
