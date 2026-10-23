import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeBg from "../assets/homebg.jpg";
import HometopBg from "../assets/hometopimg.png";
import Hometop2Bg from "../assets/top2.png";
import CampaignCard from "../components/CampaignCard";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/champaign/getAllChampaigns");
        const responseData = await res.json();
        if (!res.ok) {
          setErrorMessage(responseData?.message || "Failed to load campaigns.");
          setData([]);
          return;
        }

        setData(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        setErrorMessage("Unable to load campaigns. Please try again.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const settings = {
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading)
    return (
      <div className="">
        <Loader />
      </div>
    );

  return (
    <div>
      <div className="">
        <Slider {...settings}>
          <div className="relative ">
            <div className="HomeBanner">
              <div className="relative">
                <img
                  src={HomeBg}
                  className="w-full blur-sm md:h-[80vh]"
                  alt="HomeBG"
                />
                <div className="absolute inset-0 opacity-60 banner "></div>
                <div className=" absolute flex flex-col justify-center  px-3  inset-0">
                  <div className=" topbanner  flex justify-around px-3  inset-0">
                    <div className=" w-[85%] my-auto md:w-[60%] ">
                      <h1 className="text-2xl md:text-5xl font-bold text-gray-100 md:text-gray-800  md:mb-4">
                        Are You looking for Investing,
                      </h1>
                      <h1 className="text-xl md:text-6xl font-bold text-gray-100 md:text-gray-800 md:mb-4">
                        Invest in Batches, Secure Your Investment
                      </h1>
                      <p className=" hidden md:block md:text-2xl md:mr-24 text-gray-200">
                        A unique way of investment where investors invest in
                        batches of a program. Rest assured, your investment is
                        safe and you can withdraw whenever you want.
                      </p>
                      <div className=" mt-3  text-xl">
                        <Link
                          to={!currentUser ? "/signin" : "/profile"}
                          className="inline-block bg-blue-600 text-white px-4 md:mt-3 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                    <div className="flex my-auto justify-end">
                      <img
                        src={HometopBg}
                        className=" w-[90%] md:w-full opacity-100"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="HomeBanner">
              <div className="relative">
                <img
                  src={HomeBg}
                  className="w-full blur-sm md:h-[80vh]"
                  alt="HomeBG"
                />
                <div className="absolute banner inset-0 bg-black opacity-60 "></div>
                <div className=" absolute flex flex-col justify-center  px-3  inset-0">
                  <div className=" topbanner  flex justify-around px-3  inset-0">
                    <div className=" w-[85%] my-auto md:w-[60%] ">
                      <h1 className="text-2xl md:text-5xl text-gray-100 md:text-gray-800 font-bold  md:mb-4">
                        Are You a Entreprenuer,
                      </h1>
                      <h1 className="text-xl md:text-6xl font-bold text-gray-100 md:text-gray-800 md:mb-4">
                        Share your idea with us and get funded!
                      </h1>
                      <p className=" hidden md:block   md:text-2xl md:mr-24 text-gray-200">
                        A unique way of investment where investors invest in
                        batches of a program. Rest assured, your investment is
                        safe and you can withdraw whenever you want.
                      </p>
                      <div className=" mt-3  text-xl">
                        <Link
                          to={!currentUser ? "/signin" : "/profile"}
                          className="inline-block md:mt-3 bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600"
                        >
                          Get Started
                        </Link>
                      </div>
                    </div>
                    <div className="flex my-auto justify-end">
                      <img
                        src={Hometop2Bg}
                        className="w-[90%] md:w-full  opacity-100"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
      <div className="my-6 px-6 ">
        <h1 className="text-center mb-6 font-bold  text-4xl uppercase">
          Campaigns
        </h1>
        {errorMessage && (
          <p className="text-center text-red-600 mb-4">{errorMessage}</p>
        )}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 justify-items-center">
          {data.map((item) => (
            <div key={item._id} className="">
              <CampaignCard item={item} />
            </div>
          ))}
        </div>
        {!errorMessage && data.length === 0 && (
          <p className="text-center text-gray-600 mt-4">No campaigns found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
