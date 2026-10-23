/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const CampaignCard = ({item}) => {

  return (
    <div className="">
     
        <Link to={`/detailedChamapaign/${item._id}`} key={item._id}>
          <div className=" max-w-sm  border pb-4 border-gray-300 rounded-lg shadow-lg bg-gray-100 flex flex-col">
            <img
              className="rounded-t-lg object-cover h-60"
              src={item.coverImage}
              alt=""
            />
            <div className="flex flex-col flex-grow px-4">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 h-16 overflow-hidden">
                {item.title}
              </h5>
              <p className="text-gray-600 text-sm mt-1">
              {item.description.substring(0, 90) }...
                
              </p>
              <ProgressBar
                value={Math.round(
                  (item.amountGained / item.amountRequired) * 100
                )}
              />
              <p className="text-gray-600 text-xl mt-2 font-semibold">
                {item.amountGained} USD raised of {item.amountRequired} USD
              </p>
              <p className="text-gray-600 text-xl mt-1 font-semibold">
               <span className="font-bold">Equity:</span>  {item.equity}%
              </p>
              <p className="text-gray-600 text-xl mt-1 font-semibold">
              <span className="font-bold">Batches: </span>  {item.batches.length}
              </p>
              
            </div>
          </div>
        </Link>
     
    </div>
  );
};

export default CampaignCard;
