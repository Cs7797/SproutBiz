/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const InvestmentCard = ({ item, category }) => {
  return (
    <Link to={`/detailedChamapaign/${item._id}`} className="no-underline">
      <div className="border border-gray-300 rounded-lg shadow-lg bg-white flex flex-col hover:shadow-2xl transition-shadow duration-300 ease-in-out">
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full object-cover rounded-t-lg mb-4 h-48"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h1 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h1>
          <p className="text-gray-600 mb-4">{item.description.substring(0, 200)}...</p>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-3 text-gray-700">
              <h2 className="font-semibold">
                {category === "invested" ? (
                  <span>
                  { item.invested && <><span className="font-bold">Invested:</span> {item.invested} USD</>}
                    {item.bufferEquityHolder && (
                      <>
                      
                        <span className="font-bold pl-4">Buffer Invested:</span> {item.bufferInvested} USD
                      </>
                    )}
                  </span>
                ) : (
                  <span>
                    <span className="font-bold">Amount Required:</span> {item.amountRequired} USD
                  </span>
                )}
              </h2>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <h2 className="font-semibold">
                {category === "invested" ? (
                  <div className="flex justify-around">
                  <div className="">

                   {item.equityHolder && <> <span className="font-bold">Equity:</span> {item.equityHolder}%</>}
                  </div>
                  <div className="pl-4">

                    {item.bufferEquityHolder && (
                      <>
                     
                        <span className="font-bold">Buffer Equity:</span> {item.bufferEquityHolder}%
                      </>
                    )}
                  </div>
                  </div>
                ) : (
                  <span>
                    <span className="font-bold">Amount Gained:</span> {item.amountGained} USD
                 {  item.bufferAmountGained >0 && <div className="font-bold my-4 ">Buffer Amount Gained: {item.bufferAmountGained} USD</div>}
                  </span>
                )}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InvestmentCard;
