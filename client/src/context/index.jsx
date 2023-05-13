import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useDisconnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x27b0F11E56B6e0888d501a6Dc6e52fbA79b045Ea"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const { mutateAsync: createRequest } = useContractWrite(
    contract,
    "createRequest"
  );

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image,
      ]);

      console.log("contract call success", data);
    } catch (error) {
      alert("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const getCreatorCampaigns = async (address) => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donate", pId, {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const publishRequest = async (form) => {
    try {
      const data = await createRequest([
        form.pId,
        form.title,
        form.description,
        form.amount,
        form.imageUrl,
        form.recipient,
      ]);
      console.log("contract call success", data);
    } catch (error) {
      if (form.recipient == address) {
        alert("You can't use your address as the recipient");
      } else {
        alert(
          "Ensure the amount requested is <= the amount collected in the campaign so far!"
        );
      }
    }
  };

  const getRequests = async (pId) => {
    const requests = await contract.call("getRequests", pId);

    const parsedRequests = requests.map((request, i) => ({
      title: request.title,
      description: request.description,
      amount: ethers.utils.formatEther(request.value.toString()),
      recipient: request.recipient,
      approvers: request.approvers,
      approvalCount: request.approvalCount.toNumber(),
      imageUrl: request.sampleImg,
      complete: request.complete,
      rId: i,
    }));

    return parsedRequests;
  };

  const approveRequest = async (pId, rId) => {
    const result = await contract.call("approveRequest", pId, rId);
    return result;
  };

  const finalizeRequest = async (pId, rId) => {
    const result = await contract.call("finalizeRequest", pId, rId);
    return result;
  };

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
        getRequests,
        createRequest: publishRequest,
        approveRequest,
        finalizeRequest,
        getCreatorCampaigns,
        disconnect,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
