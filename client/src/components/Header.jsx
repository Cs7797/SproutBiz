import { apiFetch } from "../lib/api";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  logOutUserFail,
  logOutUserStart,
  logOutUserSuccess,
} from "../redux/user/userSlice";
import Logo from "../assets/logo.png";
import ProfilePic from "../assets/profile.avif";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const url = `/search/${searchText}`;
    setSearchText("");
    navigate(url);
  };
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    dispatch(logOutUserStart());
    try {
      const res = await apiFetch(`/api/user/logout`);
      const data = await res.json();
      if (data.success == false) {
        dispatch(logOutUserFail(data.message));
      }
      dispatch(logOutUserSuccess());

      navigate("/");
    } catch (error) {
      dispatch(logOutUserFail(error));
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div className="">
      <div className="lg:hidden  flex  justify-between items-center p-2 bg-[#1f2937] text-white">
        <div className="flex items-center">
          <div className="flex  items-center font-bold">
            <img src={Logo} className="h-10 pb-1" alt="logo" />
            <Link to="/" className="no-underline">
              SproutBiz
            </Link>
          </div>
        </div>
        <form action="submit" onSubmit={handleSearchSubmit}>
          <div className="flex">
            <input
              type="text"
              required
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Campaigns..."
              className="p-1  px-4 rounded-full mx-auto  bg-[#374151] w-[80%]"
            />
          </div>
        </form>
        <div className="" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xl focus:outline-none"
          >
            &#9776;
          </button>
          {menuOpen && (
            <div className="lg:hidden h-[50%] rounded-bl-lg z-20  absolute top-14 right-0 bg-[#263447] text-white p-2">
              <nav>
                <ul className="flex flex-col text-2xl text-gray-300 space-y-6 list-none items-left m-6 p-0">
                  <li className="mb-2">
                    <Link
                      to="/createChampaign"
                      className="no-underline hover:underline "
                    >
                      Create Campaign
                    </Link>
                  </li>

                  <li className="mb-2">
                    {currentUser ? (
                      <div className=" ">
                        <button
                          onClick={handleLogOut}
                          className="no-underline hover:underline mb-6"
                        >
                          Logout
                        </button>
                        <br />
                        <Link
                          to={
                            currentUser.isAdmin ? "/adminProfile" : "/profile"
                          }
                          className="no-underline hover:underline  "
                        >
                          Go to Profile
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to="/signin"
                        className="no-underline hover:underline "
                      >
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex  justify-between items-center p-2 bg-[#1f2937] text-white">
        <div className="flex items-center ">
          <div className="flex text-2xl items-center font-bold">
            <img src={Logo} className="h-12 pb-1" alt="logo" />
            <Link to="/" className="no-underline pl-2">
              SproutBiz
            </Link>
          </div>
          <div>
            <form action="submit" onSubmit={handleSearchSubmit}>
              <div className="flex">
                <input
                  type="text"
                  required
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search Campaigns..."
                  className="p-1 px-4 rounded-full mx-4 bg-[#374151] w-full"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="flex items-center">
          <nav>
            <ul className="flex list-none items-center m-0 p-0">
              <li className="mr-4">
                <Link
                  to="/createChampaign"
                  className="no-underline bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-100 font-semibold "
                >
                  Create Campaign
                </Link>
              </li>
              {/* <li className="mr-4">
                <Link to="/products" className="no-underline hover:underline">
                  Products
                </Link>
              </li>
              <li className="mr-4">
                <Link
                  to="/create-blog"
                  className="no-underline hover:underline"
                >
                  Write Blog
                </Link>
              </li>
              <li className="mr-4">
                <Link
                  to="/create-product"
                  className="no-underline hover:underline"
                >
                  Add Products
                </Link>
              </li> */}
              <li className="mr-4">
                {currentUser ? (
                  <div className="flex">
                    <button
                      onClick={handleLogOut}
                      className="mr-4 hover:bg-gray-700 transition p-2 px-4 rounded bg-black"
                    >
                      Logout
                    </button>
                    <Link
                      to={currentUser.isAdmin ? "/adminProfile" : "/profile"}
                    >
                      <img
                        src={ProfilePic}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/signin"
                    className="no-underline bg-blue-600 hover:bg-blue-700 duration-100 transition-all px-5 py-2 rounded-md font-semibold"
                  >
                    LOGIN
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
