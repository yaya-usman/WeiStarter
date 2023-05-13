import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { loader } from "../assets";
import { RequestTable, CustomButton } from "../components";

const Requests = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getRequests, contract, address, approveRequest, finalizeRequest } =
    useStateContext();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    const data = await getRequests(state.pId);
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchRequests();
  }, [contract, address]);

  const onAddNewRequest = () => {
    navigate("/campaigns/requests/new", { state });
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between">
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
          Pending Requests ({requests.length})
        </h1>
        {state?.owner == address && (
          <CustomButton
            btnType="button"
            title="Add New Request"
            styles="border-2 border-[#8c6dfd] text-[#8c6dfd]"
            handleClick={onAddNewRequest}
          />
        )}

      </div>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}
        {!isLoading && requests.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            There is no pending requests yet for this campaign
          </p>
        )}
        {!isLoading && requests.length > 0 && (
          <RequestTable
            state={state}
            address={address}
            approveRequest={approveRequest}
            finalizeRequest={finalizeRequest}
            requests={requests}
          />
        )}
      </div>
    </div>
  );
};

export default Requests;
