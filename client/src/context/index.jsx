import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { ThirdwebSDK  } from '@thirdweb-dev/sdk';
import Campaign from '../../../weistarter/artifacts/contracts/WeiStarter.sol/Campaign.json';
import { ContractWrapper } from '@thirdweb-dev/sdk/dist/declarations/src/evm/core/classes/contract-wrapper';

const sdk = new ThirdwebSDK("goerli");

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xDf7bDAdD4E0C531560b2C19F640ab13Aae36FC21');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const { data: deployedContracts, isLoading} = useContractRead(contract, 'getDeployedCampaigns');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const formatContractSummary = (data) => {
    return {
        owner: data[0],
        title: data[1],
        description: data[2],
        target: ethers.utils.formatEther(data[3]),
        deadline: data[4].toNumber(),
        image: data[5],
        amountCollected: ethers.utils.formatEther(data[6].toString()),
        donatorsCount: data[7],
        donators: data[8],
        donations: data[9],
      }
  }

  const getCampaigns = async () => {
      const parsedCampaigns = deployedContracts && deployedContracts.map(async (address, i) => {
      
      const contract  = await sdk.getContractFromAbi(address, Campaign.abi)
      const data = await contract.call('getContractSummary');
      const summary = formatContractSummary(data)
    
      return {
        ...summary,
        pId: i
      }
            
       
      });
      return parsedCampaigns;
  
  }

  const getUserCampaigns = async () => {
    let allCampaigns = await getCampaigns();
    allCampaigns = await Promise.all(allCampaigns);

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const contract  =  await sdk.getContractFromAbi(deployedContracts[pId], Campaign.abi)
    const add = await ContractWrapper.getSignerAddress()
    const formatedAmount = ethers.utils.parseEther(amount)

    // const signer = sdk.getSigner()
    // const data = await contract.send('donate',{ value: formatedAmount, to: contract.getAddress()});
    const data = await contract.call('donate');

    
    console.log(add); 
    // return data;
  }

  const getDonations = async (pId) => {
    if(!isLoading){
      console.log("cont", deployedContracts);
    }

    // const contract  =  await sdk.getContractFromAbi(deployedContracts && deployedContracts[pId], Campaign.abi)
    // const contractSummary = await contract.call('getContractSummary');
    // const donators = contractSummary.donators;
    // const donations= contractSummary.donations;
    // const numberOfDonations = donations.length;

    // const parsedDonations = [];

    // for(let i = 0; i < numberOfDonations; i++) {
    //   parsedDonations.push({
    //     donator: donators[i],
    //     donation: ethers.utils.formatEther(donations[i].toString())
    //   })
    // }

    // return parsedDonations;
    return [];
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        deployedContracts
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);

