import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreateBatch from "./pages/CreateBatch";
import CreateChampaign from "./pages/CreateChampaign";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DetailedChampaign from "./pages/DetailedChampaign";
import PrivateRoute from "./components/PrivateRoute";
import IsLogin from "./components/IsLogin";

import Header from "./components/Header";
import Success from "./pages/Success";
import UpdateChampaign from "./pages/UpdateChampaign";
import SearchResult from "./pages/SearchResult";
import Footer from "./components/Footer";
import AdminProfile from "./pages/AdminProfile";
import AdminRoute from "./components/AdminRoute";
import GetProfile from "./pages/GetProfile";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndCondition from "./pages/TermsAndCondition";
import AboutBuffer from "./pages/AboutBuffer";
import WithLocationErrorBoundary from "./utils/WithLocationError Boundary";
import Error from "./pages/Error";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="main mb-20">
        <WithLocationErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<IsLogin />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/termsAndCondition" element={<TermsAndCondition />} />
            <Route path="/aboutBuffer" element={<AboutBuffer />} />
            <Route path="/search/:searchTerm" element={<SearchResult />} />
            <Route path="/error" element={<Error />} />

            <Route
              path="/detailedChamapaign/:id"
              element={<DetailedChampaign />}
            />
            <Route path="/getProfile/:id" element={<GetProfile />} />

            <Route element={<PrivateRoute />}>
              <Route path="/success" element={<Success />} />
              <Route path="/createBatch/:id" element={<CreateBatch />} />
              <Route path="/createChampaign" element={<CreateChampaign />} />
              <Route
                path="/updateChampaign/:id"
                element={<UpdateChampaign />}
              />
              <Route path="/profile" element={<Profile />}/>
              <Route element={<AdminRoute />}>
                <Route path="/adminProfile" element={<AdminProfile />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/error" replace />} />
          </Routes>
        </WithLocationErrorBoundary>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
