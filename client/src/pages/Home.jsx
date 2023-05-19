import React, { useState, useEffect, useRef } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [value, setValue] = useState([]);
  const tRef = useRef()

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
      {/* <ReactQuill theme="snow" ref = {tRef}  value={value} onChange={setValue}/>;

      <div>{value}</div> */}
    </>
  );
};

export default Home;
