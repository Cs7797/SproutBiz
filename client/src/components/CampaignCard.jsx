/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const CampaignCard = ({item}) => {

  return (
    <Link to={`/detailedChamapaign/${item._id}`} className="campaign-card">
      <div className="campaign-card-image-wrap">
        <img className="campaign-card-image" src={item.coverImage} alt={item.title} />
        <span className="campaign-card-tag">Featured opportunity</span>
        <span className="campaign-card-arrow" aria-hidden="true">↗</span>
      </div>
      <div className="campaign-card-body">
        <h3>{item.title}</h3>
        <p className="campaign-card-description">{(item.description || "Discover this exciting opportunity.").substring(0, 105)}{item.description?.length > 105 ? "…" : ""}</p>
        <div className="campaign-card-progress">
          <div className="campaign-card-raised"><span>Raised so far</span><strong>{item.amountGained} <small>USD</small></strong></div>
          <span className="campaign-card-target">of {item.amountRequired} USD</span>
          <ProgressBar value={Math.min(100, Math.max(0, Math.round((item.amountGained / (item.amountRequired || 1)) * 100)))} />
        </div>
        <div className="campaign-card-meta"><span><small>Equity</small><strong>{item.equity}%</strong></span><span><small>Investment batches</small><strong>{item.batches?.length || 0}</strong></span></div>
      </div>
    </Link>
  );
};

export default CampaignCard;
