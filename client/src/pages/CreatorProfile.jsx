import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

const CreatorProfile = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCreatorCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCreatorCampaigns(state.address);
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default CreatorProfile;
