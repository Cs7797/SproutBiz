import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const Success = () => {
  
  const isBuffer = sessionStorage.getItem("isBuffer");
  const [products, setProducts] = useState([]);
  const [bufferMoney, setBufferMoney] = useState(
    isBuffer == "true" ? true : false
  );
  const [investmentProcessed, setInvestmentProcessed] = useState(false);
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("/api/champaign/session"); //
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);
 useEffect(() => {
   console.log("Products:", products);
   console.log("Campaign ID:", products[0]?.champaignID);
   console.log("Investment processed:", investmentProcessed);

   const updateInvestment = async () => {
     if (!investmentProcessed && products.length > 0) {
       console.log("Attempting investment POST...");

       try {
         const res = await fetch(
           `/api/champaign/invested/${products[0].champaignID}`,
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             credentials: "include",
             body: JSON.stringify({
               invested: Number(products[0].invested),
               equity: Number(products[0].equity),
             }),
           },
         );

         console.log("Investment POST status:", res.status);

         const data = await res.json();
         console.log("Investment POST response:", data);

         if (!res.ok) {
           throw new Error(data.message || "Investment update failed");
         }

         

         setBufferMoney(Boolean(data.isBuffer));
         setInvestmentProcessed(true);
       } catch (error) {
         console.error("Investment update failed:", error);
       }
     }
   };

   if (products[0]?.champaignID) {
     updateInvestment();
   }
 }, [products, investmentProcessed]);

  if (products.length < 1)
    return (
      <div>
        {" "}
        <Loader />{" "}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      {!bufferMoney ? (
        <div className="bg-slate-100 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <img
            src={products[0].coverImage}
            alt={products[0].title}
            className="w-32 h-32 mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-semibold mb-4">{products[0].title}</h1>
          {products.length > 0 && (
            <div className="mb-6">
              <p className="text-lg mb-2">
                You have successfully invested in <br />{" "}
                <span className="font-semibold">{products[0].title}</span>{" "}
                Campaign.
              </p>
              <p className="text-lg mb-2">
                You have invested{" "}
                <span className="font-semibold">${products[0].invested}</span>{" "}
                with a tip of{" "}
                <span className="font-semibold">${products[0].tip}</span>.
              </p>
              <p className="text-lg mb-2">
                You are now a shareholder of{" "}
                <span className="font-semibold">{products[0].equity}%</span> of
                this campaign.
              </p>
            </div>
          )}

          <p className="mb-4">
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
            >
              Go to Home Page
            </Link>
            <Link
              to={`/detailedChamapaign/${products[0].champaignID}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Go to Campaign
            </Link>
          </p>
        </div>
      ) : (
        <div className="bg-slate-100 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <img
            src={products[0].coverImage}
            alt={products[0].title}
            className="w-32 h-32 mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-semibold mb-4">{products[0].title}</h1>
          {products.length > 0 && (
            <div className="mb-6">
              <p className="text-lg mb-2">
                You have successfully invested in{" "}
                <span className="font-bold">buffer account</span> of
                <br />{" "}
                <span className="font-semibold">{products[0].title}</span>{" "}
                Campaign .
              </p>
              <p className="text-lg mb-2">
                You have invested{" "}
                <span className="font-semibold">${products[0].invested}</span>{" "}
                with a tip of{" "}
                <span className="font-semibold">${products[0].tip}</span>.
              </p>
              <p className="text-lg mb-2">
                You may become shareholder of{" "}
                <span className="font-semibold">{products[0].equity}%</span> of
                this campaign.
              </p>
            </div>
          )}

          <p className="mb-4">
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
            >
              Go to Home Page
            </Link>
            <Link
              to={`/detailedChamapaign/${products[0].champaignID}`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Go to Campaign
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Success;
