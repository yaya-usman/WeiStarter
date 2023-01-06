import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'


const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { address, contract, getCampaigns, deployedContracts } = useStateContext();
  
  const fetchCampaigns = async () => {
    setIsLoading(true);
    let data = await getCampaigns();
    data = await Promise.all(data);    

    setCampaigns(data);
    setIsLoading(false);
   
 }

  useEffect(() => {
    
    if(contract) fetchCampaigns();

  }, [address, contract, deployedContracts]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home